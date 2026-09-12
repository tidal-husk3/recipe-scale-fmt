import type { Ingredient } from './types.js'

// Only the spellings I've actually seen in the recipes I copy from. Extend
// as new ones show up rather than trying to enumerate every unit up front.
const UNIT_ALIASES: Record<string, string> = {
  cup: 'cup',
  cups: 'cup',
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  tbsp: 'tbsp',
  tbsps: 'tbsp',
  teaspoon: 'tsp',
  teaspoons: 'tsp',
  tsp: 'tsp',
  tsps: 'tsp',
  ounce: 'oz',
  ounces: 'oz',
  oz: 'oz',
  pound: 'lb',
  pounds: 'lb',
  lb: 'lb',
  lbs: 'lb',
  gram: 'g',
  grams: 'g',
  g: 'g',
  kilogram: 'kg',
  kilograms: 'kg',
  kg: 'kg',
  milliliter: 'ml',
  milliliters: 'ml',
  ml: 'ml',
  liter: 'l',
  liters: 'l',
  l: 'l',
  clove: 'clove',
  cloves: 'clove',
  pinch: 'pinch',
  pinches: 'pinch',
  can: 'can',
  cans: 'can',
}

function parseFractionToken(token: string): number | null {
  const match = token.match(/^(\d+)\/(\d+)$/)
  if (!match) return null
  const denominator = Number(match[2])
  if (denominator === 0) return null
  return Number(match[1]) / denominator
}

interface QuantityMatch {
  value: number
  length: number
}

// Handles "2", "1.5", "1/2", and mixed numbers like "1 1/2", in that order
// because the mixed case has to be tried before the plain fraction case.
function parseQuantity(text: string): QuantityMatch | null {
  const mixed = text.match(/^(\d+)\s+(\d+\/\d+)/)
  if (mixed) {
    const fraction = parseFractionToken(mixed[2])
    if (fraction !== null) {
      return { value: Number(mixed[1]) + fraction, length: mixed[0].length }
    }
  }

  const fraction = text.match(/^\d+\/\d+/)
  if (fraction) {
    const value = parseFractionToken(fraction[0])
    if (value !== null) return { value, length: fraction[0].length }
  }

  const decimal = text.match(/^\d+(\.\d+)?/)
  if (decimal) {
    return { value: Number(decimal[0]), length: decimal[0].length }
  }

  return null
}

export function parseLine(raw: string): Ingredient {
  const cleaned = raw.trim().replace(/\s+/g, ' ')
  if (cleaned.length === 0) {
    return { quantity: null, unit: null, name: '', raw }
  }

  const quantity = parseQuantity(cleaned)
  if (!quantity) {
    return { quantity: null, unit: null, name: cleaned, raw }
  }

  const rest = cleaned.slice(quantity.length).trim()
  const unitMatch = rest.match(/^([A-Za-z.]+)\s+(.+)$/)
  const alias = unitMatch ? UNIT_ALIASES[unitMatch[1].toLowerCase()] : undefined

  if (unitMatch && alias) {
    return { quantity: quantity.value, unit: alias, name: unitMatch[2], raw }
  }

  return { quantity: quantity.value, unit: null, name: rest, raw }
}
