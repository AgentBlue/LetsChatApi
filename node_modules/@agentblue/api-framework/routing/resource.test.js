const { Resource, resource } = require('./resource')

describe('Resource', () => {
  it('should have a name', () => {
    const res = new Resource({ name: 'api' }, ...[])
    expect(res.name).toEqual('api')
  })

  it('should have mountables', () => {
    const mountables = []
    const res = new Resource({ name: 'api' }, ...mountables )
    expect(res.mountables).toEqual(mountables)
  })

  it('should have a middleware default', () => {
    const mountables = []
    const res = new Resource({ name: 'api' }, ...mountables )
    expect(res.middleware).toEqual([])
  })

  it('should have middleware', () => {
    const mountables = []
    const middleware = [ () => {}]
    const res = new Resource({ name: 'api', middleware }, ...mountables )
    expect(res.middleware).toEqual(middleware)
  })

  it('should return a Resource from resource helper', () => {
    const mountables = []
    const res = resource({ name: 'api' }, ...mountables)
    expect(res).toBeInstanceOf(Resource)
    expect(res.name).toEqual('api')
    expect(res.mountables).toEqual(mountables)
  })

  describe('report', () => {
    it('should call mount and report on mountables', () => {
      const nestedResource = new Resource({ name: 'nested' },
        { mount: jest.fn(), report: jest.fn() }
      )
      const mountables = [
        { mount: jest.fn(), report: jest.fn() },
        { mount: jest.fn(), report: jest.fn() },
        nestedResource
      ]
      const res = new Resource({ name: 'api' }, ...mountables)
      res.report()
      expect(mountables[0].mount).toHaveBeenCalledWith({ reporting: true }, '/api', [])
      expect(mountables[1].mount).toHaveBeenCalledWith({ reporting: true }, '/api', [])
      expect(mountables[0].report).toHaveBeenCalledWith({ reporting: true })
      expect(mountables[1].report).toHaveBeenCalledWith({ reporting: true })
      expect(nestedResource.mountables[0].mount).toHaveBeenCalledWith({ reporting: true }, '/api/nested', [])
      expect(nestedResource.mountables[0].report).toHaveBeenCalledWith({ reporting: true })
    })
  })

  describe('mount', () => {
    let app
    beforeEach(() => {
      app = {}
    })

    it('should call mount on mountables', () => {
      const mountables = [
        { mount: jest.fn() },
        { mount: jest.fn() }
      ]
      const res = new Resource({ name: 'api' }, ...mountables)
      res.mount(app)
      expect(mountables[0].mount).toHaveBeenCalledWith(app, '/api', [])
      expect(mountables[1].mount).toHaveBeenCalledWith(app, '/api', [])
    })

    it('should build a complex path', () => {
      const mountables = [
        { mount: jest.fn() }
      ]
      const res = new Resource({ name: 'api' }, ...mountables)
      res.mount(app, '/foo')
      expect(mountables[0].mount).toHaveBeenCalledWith(app, '/foo/api', [])
    })

    it('should handle an empty name', () => {
      const mountables = [
        { mount: jest.fn() }
      ]
      const res = new Resource({}, ...mountables)
      res.mount(app, '/foo')
      expect(mountables[0].mount).toHaveBeenCalledWith(app, '/foo', [])
    })

    it('should handle nested resources', () => {
      const innerMountables = [{ mount: jest.fn() }]
      const inner = new Resource({ name: 'v1' }, ...innerMountables)
      const outer = new Resource({ name: 'api' }, inner)
      outer.mount(app)
      expect(innerMountables[0].mount).toHaveBeenCalledWith(app, '/api/v1', [])
    })

    it('should handle nested res middleware', () => {
      const innerMountables = [{ mount: jest.fn() }]
      const inner = new Resource({ name: 'v1', middleware: [(req, res, next) => { next() }] }, ...innerMountables)
      const outer = new Resource({ name: 'api', middleware: [(req, res, next) => { next() }] }, inner)
      outer.mount(app)
      expect(innerMountables[0].mount).toHaveBeenCalledWith(app, '/api/v1', [...outer.middleware, ...inner.middleware])
    })
  })
})
