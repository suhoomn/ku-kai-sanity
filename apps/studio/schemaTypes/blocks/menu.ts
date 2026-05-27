import { commonFields, contentFields, settingsFields } from '../common'

export const menuFeaturedRamen = {
  type: 'object',
  name: 'menuFeaturedRamen',
  title: 'Featured ramen',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown above the photo (e.g. KU-KAI RAMEN)',
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g. 150,-',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      description: 'One ingredient per line (shown as a comma-separated list on the site)',
      of: [{ type: 'string' }],
    },
    {
      name: 'addOnName',
      title: 'Add-on name (optional)',
      type: 'string',
      description: 'e.g. + Marinaded egg & Seaweed (Nori)',
    },
    {
      name: 'addOnPrice',
      title: 'Add-on price',
      type: 'string',
      description: 'e.g. 185,-',
    },
  ],
  preview: {
    select: { title: 'title', price: 'price', media: 'image' },
    prepare({ title, price, media }: any) {
      return {
        title: title || 'Ramen',
        subtitle: price || 'No price',
        media,
      }
    },
  },
}

export const menuLineItem = {
  type: 'object',
  name: 'menuLineItem',
  title: 'Menu item',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g. 30,-',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'ingredients',
      title: 'Ingredients / details (optional)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional. Use for extra lines (e.g. toppings note). Drinks can use Note instead.',
    },
    {
      name: 'note',
      title: 'Note (optional)',
      type: 'string',
      description: 'e.g. refill free — mainly for drinks',
    },
  ],
  preview: {
    select: { title: 'name', price: 'price' },
    prepare({ title, price }: any) {
      return {
        title: title || 'Untitled',
        subtitle: price || '',
      }
    },
  },
}

export const menuBlock = {
  name: 'menuBlock',
  title: 'Menu Block',
  type: 'object',
  description:
    'Edit the restaurant menu: two ramen columns (with photos), then toppings, sides, and drinks.',
  groups: [
    { name: 'content', title: 'Menu', default: true },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    ...contentFields.headers,

    {
      name: 'kukaiRamen',
      title: 'Kū-Kai ramen',
      type: 'menuFeaturedRamen',
      group: 'content',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'veganRamen',
      title: 'Vegan ramen',
      type: 'menuFeaturedRamen',
      group: 'content',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'toppings',
      title: 'Toppings',
      type: 'array',
      group: 'content',
      of: [menuLineItem],
      options: { sortable: true },
    },
    {
      name: 'sides',
      title: 'Sides',
      type: 'array',
      group: 'content',
      of: [menuLineItem],
      options: { sortable: true },
    },
    {
      name: 'drinks',
      title: 'Drinks',
      type: 'array',
      group: 'content',
      of: [menuLineItem],
      options: { sortable: true },
    },

    ...settingsFields.layout,
    { ...commonFields.backgroundColor, group: 'settings', initialValue: 'dark' },
    { ...commonFields.textColor, group: 'settings', initialValue: 'light' },
  ],
  preview: {
    select: {
      kukai: 'kukaiRamen.price',
      vegan: 'veganRamen.price',
      toppings: 'toppings',
    },
    prepare({ kukai, vegan, toppings }: any) {
      const count = toppings?.length || 0
      return {
        title: 'Menu',
        subtitle: [kukai && `Kū-Kai ${kukai}`, vegan && `Vegan ${vegan}`, count && `${count} toppings`]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
}
