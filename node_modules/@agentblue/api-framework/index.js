const Controller = require('./api/controller-base')
const { resource, Resource } = require('./routing/resource')
const { route, Route } = require('./routing/route')

module.exports = {
  ControllerBase: Controller,
  resource, Resource,
  route, Route
}