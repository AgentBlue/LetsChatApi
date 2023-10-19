const { ControllerBase, resource, Resource, route, Route } = require('./index')

describe('index', () => {
  it('should export ControllerBase constructor', () => {
    expect(ControllerBase).toBeInstanceOf(Function)
  })

  it('should export resource', () => {
    expect(resource).toBeInstanceOf(Function)
  })

  it('should export Resource', () => {
    expect(Resource).toBeInstanceOf(Function)
  })

  it('should export route', () => {
    expect(route).toBeInstanceOf(Function)
  })

  it('should export Route', () => {
    expect(Route).toBeInstanceOf(Function)
  })
})