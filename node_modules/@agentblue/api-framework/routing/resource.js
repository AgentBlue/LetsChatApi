const { each, map } = require('lodash')

class Resource {
  constructor({ name, middleware }, ...mountables) {
    this._name = name
    this._middleware = middleware || []
    this._mountables = mountables
  }

  get name() {
    return this._name
  }

  get mountables() {
    return this._mountables
  }

  get middleware() {
    return this._middleware
  }

  report(opts) {
    if (!opts) {
      this.mount({ reporting: true })
      return map(this.mountables, m => m.report({ reporting: true }))
    }
    return map(this.mountables, m => m.report({ reporting: true }))
  }

  mount(options, parentPath, middleware = []) {
    let path = ''
    if (this.name) {
      path = `/${this.name}`
    }
    if (parentPath) {
      path = `${parentPath}${path}`
    }
    each(this.mountables, m => m.mount(options, path, [...middleware, ...this.middleware]))
    return this
  }
}

function resource(options, ...mountables) {
  return new Resource(options, ...mountables)
}

module.exports = { resource, Resource }
