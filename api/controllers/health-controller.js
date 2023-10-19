import { ControllerBase } from '@agentblue/api-framework'

export default class HealthController extends ControllerBase {
  index() {
    return this.res.send({ status: 'Healthy' })
  }
}