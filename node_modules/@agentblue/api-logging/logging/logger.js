const chalk = require('chalk')
const moment = require('moment')
const { isObject } = require('lodash')
const util = require('util')

const levels = ['debug', 'info', 'warn', 'error']

class Logger {
  constructor({ fn, errFn, level }) {
    this._fn = fn
    this._errFn = errFn
    this._level = levels.indexOf(level)
    this._levelDescription = level
  }

  get fn() {
    return this._fn
  }

  get errFn() {
    return this._errFn
  }

  get level() {
    return this._levelDescription
  }

  debug(message) {
    this.log(message, { level: 0, color: 'green', fn: this.fn })
  }

  info(message) {
    this.log(message, { level: 1, color: 'cyan', fn: this.fn })
  }

  warn(message) {
    this.log(message, { level: 2, color: 'yellow', fn: this.fn })
  }

  error(message) {
    if (message instanceof Error) {
      message = message.stack
    }
    this.log(message, { level: 3, color: 'red', fn: this.errFn})
  }

  log(m, { level, color, fn }) {
    if (level >= this._level) {
      if (isObject(m)) m = `\n${util.inspect(m, { compact: false, showHidden: true, depth: null })}`
      fn(`${chalk.magenta(`${moment().format('MMMM Do YYYY, h:mm:ss a')}: `)} ${chalk[color](m)}`)
    }
  }
}

module.exports = Logger
