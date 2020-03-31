const diff = require('jest-diff').default
const O = require('fp-ts/lib/Option')

require('@testing-library/jest-dom')

beforeEach(() => {
  jest.clearAllMocks()
})

expect.extend({
  toBeNone(received) {
    const options = {
      comment: 'isNone equality',
      isNot: this.isNot,
      promise: this.promise,
    }

    const expected = O.none
    const pass = O.isNone(received)

    const passMessage = () =>
      this.utils.matcherHint('toBeNone', undefined, undefined, options) +
      '\n\n' +
      `Expected: not ${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(received)}`

    const notPassMessage = () => {
      const diffString = diff(expected, received, {
        expand: this.expand,
      })

      return (
        this.utils.matcherHint('toBeNone', undefined, undefined, options) +
        '\n\n' +
        (diffString && diffString.includes('- Expect')
          ? `Difference:\n\n${diffString}`
          : `Expected: ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`)
      )
    }

    const message = pass ? passMessage : notPassMessage

    return {
      pass,
      message,
      actual: received,
    }
  },

  toBeSome(received, expectedValue) {
    const options = {
      comment: 'isSome equality',
      isNot: this.isNot,
      promise: this.promise,
    }

    const expected = O.some(expectedValue)
    const firstPass = O.isSome(received)
    const secondPass = this.equals(received.value, expectedValue)
    const pass = expected === undefined ? firstPass : firstPass && secondPass

    const passMessage =
      this.utils.matcherHint('toBeSome', undefined, undefined, options) +
      '\n\n' +
      `Expected: not ${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(received)}`

    const notPassMessage = () => {
      const diffString = diff(expected, received, {
        expand: this.expand,
      })

      return (
        this.utils.matcherHint('toBeNone', undefined, undefined, options) +
        '\n\n' +
        (diffString && diffString.includes('- Expect')
          ? `Difference:\n\n${diffString}`
          : `Expected: (${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`)
      )
    }

    const message = pass ? passMessage : notPassMessage

    return { pass, message, actual: received }
  },
})
