import { singularNounToPluralByQuantity } from '~/utils'

describe('Utils', () => {
  describe('singularNounToPluralByQuantity', () => {
    describe('when quantity is zero', () => {
      it('should return singular nount', () => {
        expect(singularNounToPluralByQuantity(0, 'x')).toBe('x')
      })
    })

    describe('when quantity is one', () => {
      it('should return singular noun', () => {
        expect(singularNounToPluralByQuantity(1, 'x')).toBe('x')
      })
    })

    describe('when quantity is greater', () => {
      it('should return plural noun', () => {
        expect(singularNounToPluralByQuantity(2, 'x')).toBe('xs')
      })
    })
  })
})
