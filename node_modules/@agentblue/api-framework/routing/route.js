const { get, isArray } = require('lodash')

class Route {
  constructor({ verb, path = '', to, middleware = [], fn }) {
    this._verb = verb
    this._fn = fn
    this._to = to
    this._middleware = middleware
    if (isArray(path)) {
      this._path = `/${path.join('/')}`
    } else {
      if (path.charAt(0) !== '/') {
        this._path = `/${path}`
      } else {
        this._path = path
      }
    }
    this._fullPath = this._path
  }

  get to() {
    return this._to
  }

  get path() {
    return this._path
  }

  get fn() {
    return this._fn
  }

  get verb() {
    return this._verb
  }

  get middleware() {
    return this._middleware
  }

  get fullPath() {
    return this._fullPath
  }

  report() {
    return `${this.verb.toUpperCase()} ${this.fullPath} -> ${this.fn ? '[Function]' : this.to}`
  }

  mount(options, prefix, middleware = []) {
    const { app, controllers } = options
    const reporting = get(options, 'reporting', false)
    let fullPath = this.path
    if (prefix) {
      fullPath = `${prefix}${this.path}`.replace(/(\/){2,}/g, '/')
      if (fullPath.charAt(fullPath.length -1 ) === '/') {
        fullPath = fullPath.slice(0, fullPath.length -1 )
      }
    }
    this._fullPath = fullPath
    if (reporting) return

    let fn = this.fn
    if (this.to && !fn) {
      const [name, method] = this.to.split('#')
      if (!controllers[name]) {
        throw new Error(`No controller for "${name}" for route ${fullPath} -> ${this.to}`)
      }
      fn = async function() {
        const controller = new controllers[name](options, ...arguments)
        try {
          await controller[method].apply(controller, arguments)
        } catch (e) {
          controller.handleError(e)
        }
      }
    }

    app[this.verb](fullPath, ...[...middleware, ...this.middleware, fn])
  }
}

function route(options) {
  return new Route(options)
}

module.exports = { route, Route }
