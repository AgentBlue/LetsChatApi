export default class Api {
  constructor(context) {
    this._context = context
    const { app, port, routes } = context
    this._app = app
    this._port = port
    this._routes = routes
  }

  get context() {
    return this._context
  }

  get app() {
    return this._app
  }

  get port() {
    return this._port
  }

  get routes() {
    return this._routes
  }

  start(fn) {
    this.routes.mount(this.context)
    this.app.listen(this.port, fn)
  }
}