import type { Ingredient } from './types.js'

// Round to two decimal places and drop trailing zeros, so 1.5x scaling of
// "2 cups" prints "3 cups" and not "3.00 cups".
function formatQuantity(value: number): string {
  const rounded = Math.round(value * 100) / 100
  if (Number.isInteger(rounded)) return String(rounded)
  return String(rounded)
}

export function formatIngredient(ingredient: Ingredient, scale: number): string {
  if (ingredient.name.length === 0) return ''
  if (ingredient.quantity === null) return ingredient.name

  const parts = [formatQuantity(ingredient.quantity * scale)]
  if (ingredient.unit) parts.push(ingredient.unit)
  parts.push(ingredient.name)
  return parts.join(' ')
}
