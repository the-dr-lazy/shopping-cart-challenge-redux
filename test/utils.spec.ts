import * as t from 'io-ts'

import { singularNounToPluralByQuantity, json } from '~/utils'

describe('Utils.singularNounToPluralByQuantity', () => {
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

describe('Utils.json', () => {
  const c = t.strict({
    x: t.string,
    y: t.number,
  })
  const parse = json(c)

  describe('when input has JSON parsing error', () => {
    it('should return `None`', () => {
      expect(parse('{ x: "foo", y: 333 }')).toBeNone()
    })
  })

  describe('when input cannot decode by decoder', () => {
    it('should return `None`', () => {
      expect(parse('{ "x": 222, "y": 333 }')).toBeNone()
    })
  })

  describe('when input is correct', () => {
    it('should return `Some`', () => {
      expect(parse('{ "x": "foo", "y": 333 }')).toBeSome({ x: 'foo', y: 333 })
    })
  })
})
