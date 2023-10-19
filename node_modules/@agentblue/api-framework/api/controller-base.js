const { get } = require('lodash')

class Controller {
  constructor(context, req, res, next) {
    this._context = context

    const { logger } = context
    this._logger = logger
    this._req = req
    this._res = res
    this._next = next
  }

  get logger() {
    return this._logger
  }

  get req() {
    return this._req
  }

  get res() {
    return this._res
  }

  get next() {
    return this._next
  }

  get context() {
    return this._context
  }

  get query() {
    return this.req.query
  }

  get params() {
    return this.req.params
  }

  get body() {
    return this.req.body
  }

  get page() {
    const def = 0
    const { page } = this.query
    if (!page) return def

    const parsed = parseInt(page)
    if (isNaN(parsed)) {
      return def
    }

    return parsed
  }

  get limit() {
    const def = 50
    const { limit } = this.query
    if (!limit) return def

    const parsed = parseInt(limit)
    if (isNaN(parsed)) {
      return def
    }
    return parsed
  }

  get pagination() {
    const { limit, page } = this
    const offset = page * limit
    return { limit, offset }
  }

  handleError(err) {
    this.logger.error(err)
    if (!this.res.headersSent) {
      this.res.sendStatus(500)
    }
  }
}

module.exports = Controller
