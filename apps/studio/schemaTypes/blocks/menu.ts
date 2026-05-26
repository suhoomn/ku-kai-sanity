import { commonFields, contentFields, settingsFields } from '../common'

export const menuBlock = {
  name: 'menuBlock',
  title: 'Menu Block',
  type: 'object',
  description: 'Display a menu with sections (RAMEN, DRINKS, SIDES) that can be reordered. Each section contains items with prices and ingredients.',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true
    },
    {
      name: 'settings',
      title: 'Settings',
    }
  ],
  fields: [
    // Headers
    ...contentFields.headers,
    
    // Menu Sections
    {
      name: 'menuSections',
      title: 'Menu Sections',
      type: 'array',
      group: 'content',
      description: 'Add menu sections (e.g., RAMEN, DRINKS, SIDES). You can reorder them by dragging.',
      of: [
        {
          type: 'object',
          name: 'menuSection',
          title: 'Menu Section',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'Name of the section (e.g., "KU-KAI RAMEN", "TOPPINGS")',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'layout',
              title: 'Layout',
              type: 'string',
              description: 'Featured = top row (Kukai / Vegan). List = full width (Toppings). Half = bottom row (Sides / Drinks).',
              options: {
                list: [
                  { title: 'Featured — top row column', value: 'featured' },
                  { title: 'List — full width', value: 'list' },
                  { title: 'Half — bottom row column', value: 'half' },
                ],
                layout: 'radio',
              },
            },
            {
              name: 'image',
              title: 'Section Photo',
              type: 'image',
              description: 'Large photo for featured ramen columns (e.g. bowl photo)',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'items',
              title: 'Menu Items',
              type: 'array',
              description: 'Items in this section',
              of: [
                {
                  type: 'object',
                  name: 'menuItem',
                  title: 'Menu Item',
                  fields: [
                    {
                      name: 'name',
                      title: 'Item Name',
                      type: 'string',
                      description: 'Name of the menu item',
                      validation: (Rule: any) => Rule.required()
                    },
                    {
                      name: 'price',
                      title: 'Price',
                      type: 'string',
                      description: 'Price (e.g., "100,-", "50,-")',
                      validation: (Rule: any) => Rule.required()
                    },
                    {
                      name: 'ingredients',
                      title: 'Ingredients',
                      type: 'array',
                      description: 'List of ingredients (optional)',
                      of: [
                        {
                          type: 'string'
                        }
                      ]
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      description: 'Optional description for this item'
                    }
                  ],
                  preview: {
                    select: {
                      title: 'name',
                      price: 'price'
                    },
                    prepare({ title, price }: any) {
                      return {
                        title: title || 'Untitled',
                        subtitle: price ? `Price: ${price}` : 'No price'
                      }
                    }
                  }
                }
              ],
              validation: (Rule: any) => Rule.min(1)
            }
          ],
          preview: {
            select: {
              title: 'title',
              items: 'items'
            },
            prepare({ title, items }: any) {
              return {
                title: title || 'Untitled Section',
                subtitle: items ? `${items.length} item${items.length !== 1 ? 's' : ''}` : 'No items'
              }
            }
          }
        }
      ],
      validation: (Rule: any) => Rule.required().min(1)
    },

    // Component settings
    ...settingsFields.layout,
    { ...commonFields.backgroundColor, group: 'settings', initialValue: 'dark' },
    { ...commonFields.textColor, group: 'settings', initialValue: 'light' },
  ],
  preview: {
    select: {
      title: 'header',
      sections: 'menuSections'
    },
    prepare({ title, sections }: any) {
      return {
        title: title || 'Menu Block',
        subtitle: sections ? `${sections.length} section${sections.length !== 1 ? 's' : ''}` : 'No sections'
      }
    }
  }
}


