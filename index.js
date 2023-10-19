import Application from './application.js'
import dotenv from 'dotenv'

dotenv.config()
const environment = process.env
if (!environment.NODE_ENV) {
  environment.NODE_ENV = 'development'
}

environment.PORT = environment.PORT || 5001

const application = new Application()
application.main({ environment })
