const moment = require('moment')

module.exports = (logger) => {
  return async function(req, res, next) {
    const start = moment()
    await next()
    let diff = moment().diff(start)
    if (diff < 1) {
      diff = '<1'
    }
    logger.debug(`${req.method} ${req.url} completed in ${diff}ms`)
  }
}