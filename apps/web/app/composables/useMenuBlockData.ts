/**
 * Normalizes menuBlock CMS data (flat fields or legacy menuSections) for MenuBlock.vue.
 */

export type MenuFeatured = {
  title: string
  image: unknown
  price: string
  ingredients: string[]
  addOnName?: string
  addOnPrice?: string
}

export type MenuLineItem = {
  name: string
  price: string
  ingredients?: string[]
  note?: string
}

export type NormalizedMenuBlock = {
  source: 'structured' | 'legacy' | 'empty'
  kukai: MenuFeatured | null
  vegan: MenuFeatured | null
  toppings: MenuLineItem[]
  sides: MenuLineItem[]
  drinks: MenuLineItem[]
}

function hasIngredients(item: { ingredients?: string[] }) {
  return Array.isArray(item.ingredients) && item.ingredients.length > 0
}

function formatIngredients(item: { ingredients: string[] }) {
  return item.ingredients.join(', ')
}

function itemTextBlob(item: {
  name?: string
  ingredients?: string[]
  description?: string
  note?: string
}) {
  const parts = [
    item.name || '',
    hasIngredients(item) ? formatIngredients(item as { ingredients: string[] }) : '',
    item.description || '',
    item.note || '',
  ]
  return parts.join(' ').toLowerCase()
}

function isKukaiMenuItem(item: { name?: string; ingredients?: string[]; description?: string }) {
  const blob = itemTextBlob(item)
  if (/vegan|shoyu|tan-tan|tan tan/.test(blob)) return false
  if (/mushroom broth w\. white sesame|miso-seasoned soy meat|zha cai|beet sprouts/.test(blob)) {
    return false
  }
  if (/mushroom broth, bamboo shoot|oyster mushroom|purløg|purlog|choy sum/.test(blob)) {
    return false
  }
  if (/nasturtium|nasturium|shiitake oil|thyme/.test(blob) && !/tonkotsu/.test(blob)) {
    return false
  }
  return true
}

function isVeganMenuItem(item: { name?: string; ingredients?: string[]; description?: string }) {
  const blob = itemTextBlob(item)
  return /vegan|tan-tan|tan tan|mushroom broth w\. white sesame|miso-seasoned soy meat|zha cai|mushroom broth, bamboo shoot|oyster mushroom/.test(
    blob,
  )
}

/** Old CMS stored all toppings in one item's ingredients list — expand for the grid UI. */
function expandLegacyToppingItems(item: {
  name?: string
  price?: string
  ingredients?: string[]
  description?: string
}): MenuLineItem[] {
  const name = item.name?.trim() || ''
  const lines = (item.ingredients || []).map((line) => line.trim()).filter(Boolean)

  if (!/topping/i.test(name) || lines.length <= 1) {
    const single = lineItemFromLegacy(item)
    return single ? [single] : []
  }

  return lines
    .map((line) => {
      const match = line.match(/^(.+?)\s+(\d+)\s*kr[,.]?\s*-?/i)
      if (match) {
        return {
          name: match[1].replace(/\s*★.*$/i, '').trim(),
          price: `${match[2]},-`,
        }
      }
      return { name: line.replace(/\s*★.*$/i, '').trim(), price: '' }
    })
    .filter((row) => row.name) as MenuLineItem[]
}

function lineItemFromLegacy(item: {
  name?: string
  price?: string
  ingredients?: string[]
  description?: string
}): MenuLineItem | null {
  if (!item.name?.trim() && !hasIngredients(item)) {
    return null
  }
  return {
    name: item.name?.trim() || '',
    price: item.price?.trim() || '',
    ingredients: item.ingredients,
    note: item.description?.trim() || undefined,
  }
}

function featuredFromLegacyItem(
  item: { name?: string; price?: string; ingredients?: string[]; description?: string },
  sectionImage: unknown,
  defaults: { title: string; isVegan: boolean },
): MenuFeatured {
  const name = item.name?.trim() || ''
  const isAddOn = name.startsWith('+')
  const baseIngredients = item.ingredients || []

  let title = defaults.title
  if (defaults.isVegan && name && !isAddOn) {
    title = name
  } else if (!defaults.isVegan && name && !/^ramen$/i.test(name) && !isAddOn) {
    title = name
  }

  const featured: MenuFeatured = {
    title,
    image: sectionImage,
    price: item.price?.trim() || '',
    ingredients: baseIngredients,
  }

  if (isAddOn) {
    featured.addOnName = name
    featured.addOnPrice = item.price?.trim() || ''
    featured.price = featured.price || ''
  }

  return featured
}

function featuredFromStructured(raw: Record<string, unknown> | null | undefined, defaultTitle: string): MenuFeatured | null {
  if (!raw || (!raw.price && !hasIngredients(raw as { ingredients?: string[] }))) {
    return null
  }

  return {
    title: (raw.title as string)?.trim() || defaultTitle,
    image: raw.image,
    price: (raw.price as string)?.trim() || '',
    ingredients: (raw.ingredients as string[]) || [],
    addOnName: (raw.addOnName as string)?.trim() || undefined,
    addOnPrice: (raw.addOnPrice as string)?.trim() || undefined,
  }
}

function lineItemsFromStructured(list: unknown): MenuLineItem[] {
  if (!Array.isArray(list)) {
    return []
  }

  return list
    .map((entry) => {
      const row = entry as MenuLineItem
      if (!row?.name?.trim()) {
        return null
      }
      return {
        name: row.name.trim(),
        price: row.price?.trim() || '',
        ingredients: row.ingredients,
        note: row.note?.trim() || undefined,
      }
    })
    .filter(Boolean) as MenuLineItem[]
}

function legacyFromSections(sections: unknown[]): NormalizedMenuBlock {
  const empty: NormalizedMenuBlock = {
    source: 'legacy',
    kukai: null,
    vegan: null,
    toppings: [],
    sides: [],
    drinks: [],
  }

  if (!sections.length) {
    return { ...empty, source: 'empty' }
  }

  for (const rawSection of sections) {
    const section = rawSection as {
      title?: string
      image?: unknown
      items?: Array<{
        name?: string
        price?: string
        ingredients?: string[]
        description?: string
      }>
    }
    const title = (section.title || '').toLowerCase()
    const items = section.items || []

    if (/topping/.test(title)) {
      items.forEach((item) => {
        expandLegacyToppingItems(item).forEach((line) => {
          if (line.name) {
            empty.toppings.push(line)
          }
        })
      })
      continue
    }

    if (/side/.test(title)) {
      items.forEach((item) => {
        const line = lineItemFromLegacy(item)
        if (line?.name) {
          empty.sides.push(line)
        }
      })
      continue
    }

    if (/drink/.test(title)) {
      items.forEach((item) => {
        const line = lineItemFromLegacy(item)
        if (line?.name) {
          empty.drinks.push(line)
        }
      })
      continue
    }

    if (/ramen|kukai|ku-kai|vegan/.test(title) || items.some((item) => hasIngredients(item))) {
      const kukaiItems = items.filter(isKukaiMenuItem)
      const veganItems = items.filter(isVeganMenuItem)

      if (kukaiItems.length && !empty.kukai) {
        const base = kukaiItems.find((item) => !item.name?.trim().startsWith('+')) || kukaiItems[0]
        const addOn = kukaiItems.find((item) => item.name?.trim().startsWith('+'))
        empty.kukai = featuredFromLegacyItem(base, section.image, { title: 'KU-KAI RAMEN', isVegan: false })
        if (addOn) {
          empty.kukai.addOnName = addOn.name?.trim()
          empty.kukai.addOnPrice = addOn.price?.trim()
        }
      }

      if (veganItems.length && !empty.vegan) {
        const base = veganItems.find((item) => !item.name?.trim().startsWith('+')) || veganItems[0]
        empty.vegan = featuredFromLegacyItem(base, section.image, {
          title: 'Vegan tan-tan men',
          isVegan: true,
        })
      }
    }
  }

  return empty
}

export function normalizeMenuBlockData(data: Record<string, unknown> | null | undefined): NormalizedMenuBlock {
  const kukai = featuredFromStructured(data?.kukaiRamen as Record<string, unknown>, 'KU-KAI RAMEN')
  const vegan = featuredFromStructured(data?.veganRamen as Record<string, unknown>, 'Vegan tan-tan men')
  const toppings = lineItemsFromStructured(data?.toppings)
  const sides = lineItemsFromStructured(data?.sides)
  const drinks = lineItemsFromStructured(data?.drinks)

  const sections = data?.menuSections
  const legacy =
    Array.isArray(sections) && sections.length > 0 ? legacyFromSections(sections) : null

  const hasStructured =
    kukai ||
    vegan ||
    toppings.length > 0 ||
    sides.length > 0 ||
    drinks.length > 0

  if (hasStructured && legacy) {
    return {
      source: 'structured',
      kukai: kukai || legacy.kukai,
      vegan: vegan || legacy.vegan,
      toppings: toppings.length ? toppings : legacy.toppings,
      sides: sides.length ? sides : legacy.sides,
      drinks: drinks.length ? drinks : legacy.drinks,
    }
  }

  if (hasStructured) {
    return {
      source: 'structured',
      kukai,
      vegan,
      toppings,
      sides,
      drinks,
    }
  }

  if (legacy) {
    return legacy
  }

  return {
    source: 'empty',
    kukai: null,
    vegan: null,
    toppings: [],
    sides: [],
    drinks: [],
  }
}

export function menuHasContent(menu: NormalizedMenuBlock) {
  return Boolean(
    menu.kukai ||
      menu.vegan ||
      menu.toppings.length ||
      menu.sides.length ||
      menu.drinks.length,
  )
}
