/*
 * A simple conversion from signular to plural for regular nouns!
 */
export function singularNounToPluralByQuantity(
  quantity: number,
  singular: string
) {
  return quantity >= 2 ? singular + 's' : singular
}
