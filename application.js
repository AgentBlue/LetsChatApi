import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import axios from 'axios'
// import mongoose from 'mongoose'


import { Logger } from '@agentblue/api-logging'
import { resource, route } from '@agentblue/api-framework'
import Api from './api/index.js'
import initRoutes from './api/routes/index.js'
import controllers from './api/controllers/index.js'

// Services

// Middleware

// import initializeMongo from './mongo/index.js'
// import initializeRepositories from './repositories/index.js'


export default class Application {
  async main({ environment }) {
    const context = await this.initialize(environment)

    // All arguments passed to the API constructor will be available in each controller's context
    // e.g. within a controller method you can access services as this.context.services
    const api = new Api(context)

    api.start(() => {
      context.logger.info(`API listening on port ${context.port}...`)
    })
  }

  async initialize(environment) {

    // eslint-disable-next-line no-console
    const logger = new Logger({ fn: console.log, errFn: console.error, level: environment.LOG_LEVEL || 'debug' })

    // Init mongo db
    // initializeMongo(mongoose)
    // const repositories = initializeRepositories({ orm: mongoose })

    // Services

    const services = {
      // add services here to make them available in controller methods and chatGPT functions
    }

    // mongoose.set('strictQuery', false)
    // await mongoose.connect(environment.MONGO_URL)

    const app = express()
    app.use(cors({
      origin: [/(http|https):\/\/localhost+(:\d+)?/],
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
    }))
    app.use(bodyParser.json({ limit: environment.MAX_BODY_SIZE }))
    app.use(bodyParser.urlencoded({ extended: true, limit: environment.MAX_BODY_SIZE }))
    app.use(morgan(':date[web] :method :url :status :response-time ms - :res[content-length]'))
    app.disable('etag')

    // Routes
    const routes = initRoutes({
      resource,
      route,
      middleware: {
      }
    })

    const context = {
      app,
      port: environment.PORT,
      controllers,
      // repositories,
      services,
      logger,
      routes
    }

    return context
  }
}