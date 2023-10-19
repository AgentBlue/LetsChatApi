const { Route, route } = require('./route')

describe('r', () => {
  it('should have a fn', () => {
    const fn = jest.fn()
    const r = new Route({ path: '/foo', fn })
    expect(r.fn).toEqual(fn)
  })

  it('should have a verb', () => {
    const r = new Route({ fn: jest.fn, path: '/foo', verb: 'get' })
    expect(r.verb).toEqual('get')
  })

  it('should have a middleware default', () => {
    const r = new Route({ fn: jest.fn, path: '/foo', verb: 'get' })
    expect(r.middleware).toEqual([])
  })

  it('should have middleware', () => {
    const middleware = [() => {}]
    const r = new Route({ fn: jest.fn, path: '/foo', verb: 'get', middleware })
    expect(r.middleware).toEqual(middleware)
  })

  it('should have a to', () => {
    const to = 'Foo#index'
    const r = new Route({ path: '/foo', verb: 'get', to })
    expect(r.to).toEqual(to)
  })

  it('should have a fullPath', () => {
    const r = new Route({ path: '/foo', verb: 'get', to: 'Foo#index' })
    expect(r.fullPath).toEqual('/foo')
  })

  it('should return a Route from route helper', () => {
    const r = route({ verb: 'get', to: 'Foo#index' })
    expect(r).toBeInstanceOf(Route)
    expect(r.to).toEqual('Foo#index')
    expect(r.verb).toEqual('get')
    expect(r.path).toEqual('/')
  })

  describe('path', () => {
    it('should have a path', () => {
      const path = '/foo'
      const r = new Route({ path })
      expect(r.path).toEqual(path)
    })

    it('should handle an array of path fragments', () => {
      const path = ['foo', 'bar', 'baz']
      const r = new Route({ path })
      expect(r.path).toEqual('/foo/bar/baz')
    })

    it('should handle a path without a leading slash', () => {
      const path = 'foo'
      const r = new Route({ path })
      expect(r.path).toEqual('/foo')
    })
  })

  describe('report', () => {
    it('should return the correct description', () => {
      const r = new Route({ path: '/foo', verb: 'get', to: 'Foo#index' })
      expect(r.report()).toEqual('GET /foo -> Foo#index')
    })

    it('should return the correct description if using an fn', () => {
      const r = new Route({ path: '/foo', verb: 'get', fn: jest.fn() })
      expect(r.report()).toEqual('GET /foo -> [Function]')
    })
  })

  describe('mount', () => {
    let app, path, fn
    beforeEach(() => {
      app = {
        'get': jest.fn()
      }
      path = ['foo', 'bar']
      fn = jest.fn()
    })

    it('should call the verb method', () => {
      const r = new Route({ verb: 'get', path, fn })
      r.mount({ app })
      expect(app.get).toHaveBeenCalledWith('/foo/bar', fn)
    })

    it('should build path when supplied a prefix', () => {
      const r = new Route({ verb: 'get', path, fn })
      r.mount({ app }, '/api/v1')
      expect(app.get).toHaveBeenCalledWith('/api/v1/foo/bar', fn)
    })

    it('should handle a path with duplicate slashes', () => {
      const r = new Route({ verb: 'get', path, fn })
      r.mount({ app }, '/api/v1/')
      expect(app.get).toHaveBeenCalledWith('/api/v1/foo/bar', fn)
    })

    it('should set the fullPath after mounting', () => {
      const r = new Route({ verb: 'get', path, fn })
      r.mount({ app }, '/api/v1/')
      expect(r.fullPath).toEqual('/api/v1/foo/bar')
    })

    it('should not include trailing slashes in fullPath', () => {
      const r = new Route({ verb: 'get', path: '/foo/bar/', fn })
      r.mount({ app }, '/api/v1/')
      expect(r.fullPath).toEqual('/api/v1/foo/bar')
    })

    it('should handle resource middleware', () => {
      const middleware = [
        (req, res, next) => { next() }
      ]
      const r = new Route({ verb: 'get', path, fn })
      r.mount({ app }, '/api/v1', middleware)
      expect(app.get).toHaveBeenCalledWith('/api/v1/foo/bar', middleware[0], fn)
    })

    it('should handle r middleware', () => {
      const middleware = [
        (req, res, next) => { next() }
      ]
      const r = new Route({ verb: 'get', path, fn, middleware })
      r.mount({ app }, '/api/v1')
      expect(app.get).toHaveBeenCalledWith('/api/v1/foo/bar', middleware[0], fn)
    })

    it('should handle r and resource middleware', () => {
      const resourceMiddleware = [
        (req, res, next) => { next() }
      ]
      const routeMiddleware = [
        (req, res, next) => { next() }
      ]
      const r = new Route({ verb: 'get', path, fn, middleware: routeMiddleware })
      r.mount({ app }, '/api/v1', resourceMiddleware)
      expect(app.get).toHaveBeenCalledWith('/api/v1/foo/bar', resourceMiddleware[0], routeMiddleware[0], fn)
    })

    it('should not setup app handler if reporting is true', () => {
      const r = new Route({ verb: 'get', path, fn })
      r.mount({ app, reporting: true }, '/api/v1/')
      expect(app.get).not.toHaveBeenCalled()
    })

    describe('with controller and to', () => {
      let index, throws, handleError, controllers
      beforeEach(() => {
        index = jest.fn()
        throws = jest.fn().mockRejectedValue(new Error('blew up'))
        handleError = jest.fn()
        controllers = {
          Foo: function() {
            this.index = index
            this.throws = throws
            this.handleError = handleError
          }
        }
      })

      it('should handle a r with to', async () => {
        const r = new Route({ path: '/foo', verb: 'get', to: 'Foo#index' })
        r.mount({ app, controllers }, '/api/v1')
        const wrappedControllerFn = app.get.mock.calls[0][1]
        await wrappedControllerFn()
        expect(index).toHaveBeenCalled()
      })

      it('should throw an error if to contains invalid controller', () => {
        const r = new Route({ path: '/bar', verb: 'get', to: 'Bar#index' })
        expect(() => { r.mount({ app, controllers }, '/api/v1') }).toThrow()
      })

      it('should handle errors', async () => {
        const r = new Route({ path: '/kaboom', verb: 'get', to: 'Foo#throws' })
        r.mount({ app, controllers }, '/api/v1')
        const wrappedControllerFn = app.get.mock.calls[0][1]
        await wrappedControllerFn()
        expect(throws).toHaveBeenCalled()
        expect(handleError).toHaveBeenCalled()
      })
    })
  })
})
