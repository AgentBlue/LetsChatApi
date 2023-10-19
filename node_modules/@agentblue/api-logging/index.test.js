const { Logger, requestLogger } = require('./index')

describe('index', () => {
  it('should export Logger', () => {
    expect(Logger).toBeInstanceOf(Function)
  })

  it('should export requestLogger', () => {
    expect(requestLogger).toBeInstanceOf(Function)
  })
})