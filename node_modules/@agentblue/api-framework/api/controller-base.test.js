const Controller = require('./controller-base')

describe('Controller', () => {
  let controller, context, logger, req, res, next
  beforeEach(() => {
    logger = {
      error: jest.fn()
    }
    context = { logger }
    req = {
      query: {},
      params: {},
      body: {}
    }
    res = {
      sendStatus: jest.fn()
    }
    next = jest.fn()
    controller = new Controller(context, req, res, next)
  })

  it('should have a logger', () => {
    expect(controller.logger).toEqual(logger)
  })

  it('should have context', () => {
    expect(controller.context).toEqual(context)
  })

  it('should have req', () => {
    expect(controller.req).toEqual(req)
  })

  it('should have res', () => {
    expect(controller.res).toEqual(res)
  })

  it('should have next', () => {
    expect(controller.next).toEqual(next)
  })

  it('should have query', () => {
    expect(controller.query).toEqual(req.query)
  })

  it('should have params', () => {
    expect(controller.params).toEqual(req.params)
  })

  it('should have body', () => {
    expect(controller.body).toEqual(req.body)
  })

  describe('limit', () => {
    it('should have limit', () => {
      expect(controller.limit).toEqual(50)
    })

    it('should return the query limit if it exists', () => {
      req.query.limit = 10
      expect(controller.limit).toEqual(10)
    })

    it('should return 50 if limit isNaN', () => {
      req.query.limit = '"25"'
      controller = new Controller(context, req, res, next)
      expect(controller.limit).toEqual(50)
    })
  })

  describe('page', () => {
    it('should return 1 if page does not exist in query', () => {
      expect(controller.page).toEqual(0)
    })

    it('should return 1 if page isNaN', () => {
      req.query.page = 'foo'
      controller = new Controller(context, req, res, next)
      expect(controller.page).toEqual(0)
    })

    it('should return the page', () => {
      req.query.page = '5'
      controller = new Controller(context, req, res, next)
      expect(controller.page).toEqual(5)
    })
  })

  describe('pagination', () => {
    it('should return the correct default pagination', () => {
      controller = new Controller(context, req, res, next)
      expect(controller.pagination).toEqual({ limit: 50, offset: 0 })
    })

    it('should return the correct pagination for other pages', () => {
      req.query.page = 10
      controller = new Controller(context, req, res, next)
      expect(controller.pagination).toEqual({ limit: 50, offset: 500 })
    })

    it('should return 1 if page is not a number', () => {
      req.query.page = 'foo'
      controller = new Controller(context, req, res, next)
      expect(controller.pagination).toEqual({ limit: 50, offset: 0 })
    })
  })

  describe('handleError', () => {
    it('should return 500 status and log error', () => {
      const error = new Error('foo')
      expect(() => {
        controller.handleError(error)
      }).not.toThrow(error)
      expect(controller.logger.error).toHaveBeenCalledWith(error)
      expect(res.sendStatus).toHaveBeenCalledWith(500)
    })

    it('should not return a 500 status if the headers are already sent', () => {
      const error = new Error('foo')
      controller.res.headersSent = true
      expect(() => {
        controller.handleError(error)
      }).not.toThrow(error)
      expect(controller.logger.error).toHaveBeenCalledWith(error)
      expect(res.sendStatus).not.toHaveBeenCalled()
    })
  })
})
