const requestLogger = require('./request-logger')

describe('requestLogger', () => {
  let logger, reqLogger, req
  beforeEach(() => {
    logger = {
      debug: jest.fn()
    }
    reqLogger = requestLogger(logger)
    req = {
      method: 'POST',
      path: '/foo'
    }
  })

  it('should return a function', () => {
    expect(reqLogger).toBeInstanceOf(Function)
  })

  it('should call next', () => {
    const next = jest.fn()
    reqLogger(req, {}, next)
    expect(next).toHaveBeenCalled()
  })

  it('should call logger.debug', async () => {
    const next = jest.fn()
    await reqLogger(req, {}, next)
    expect(logger.debug).toHaveBeenCalledTimes(1)
  })
})