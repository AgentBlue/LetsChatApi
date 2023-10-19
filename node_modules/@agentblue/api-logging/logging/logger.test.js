const Logger = require('./logger')

describe('Logger', () => {
  it('should have an fn', () => {
    const fn = jest.fn()
    const logger = new Logger({ fn })
    expect(logger.fn).toBe(fn)
  })

  it('should have an errFn', () => {
    const fn = jest.fn()
    const logger = new  Logger({ errFn: fn })
    expect(logger.errFn).toBe(fn)
  })

  it('should have a level', () => {
    const level = 'warn'
    const logger = new Logger({ level })
    expect(logger.level).toBe(level)
  })

  describe('logging methods', () => {
    let fn, errFn, logger, message
    beforeEach(() => {
      fn = jest.fn()
      errFn = jest.fn()
      message = { id: 1, name: 'foo', fn: () => {}, bar: undefined }
      logger = new Logger({ fn, errFn, level: 'debug' })
    })

    it('should call fn from debug', () => {
      logger.debug(message)
      expect(fn).toHaveBeenCalled()
    })

    it('should call fn from info', () => {
      logger.info(message)
      expect(fn).toHaveBeenCalled()
    })

    it('should call fn from warn', () => {
      logger.warn(message)
      expect(fn).toHaveBeenCalled()
    })

    it('should call errFn from error', () => {
      const err = new Error('foo')
      err.stack = 'log stack message'
      logger.error(err)
      expect(errFn).toHaveBeenCalled()
      expect(errFn.mock.calls[0][0].indexOf(err.stack)).toBeGreaterThan(-1)
    })
  })

  describe('level', () => {
    let fn, errFn
    beforeEach(() => {
      fn = jest.fn()
      errFn = jest.fn()
    })

    it('should log if level is lower than message level', () => {
      const logger = new Logger({ fn, errFn, level: 'debug' })
      logger.debug('foo')
      logger.info('foo')
      logger.warn('foo')
      logger.error('foo')
      expect(fn).toHaveBeenCalledTimes(3)
      expect(errFn).toHaveBeenCalledTimes(1)
    })

    it('should not log if level is higher than message level', () => {
      const logger = new Logger({ fn, errFn, level: 'error' })
      logger.debug('foo')
      logger.info('foo')
      logger.warn('foo')
      logger.error('foo')
      expect(fn).toHaveBeenCalledTimes(0)
      expect(errFn).toHaveBeenCalledTimes(1)
    })
  })
})