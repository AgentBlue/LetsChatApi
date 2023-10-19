// Implement a repository by extending this class and adding methods as required.
// The class accepts a cache but implementation is up to the implementer.
export default class MongoRepositoryBase {
    constructor({ orm, cache }, modelName) {
      this._orm = orm
      this._cache = cache
      this._modelName = modelName
  
      if (!orm.model(modelName)) {
        throw new Error(`Invalid model name '${modelName}'.`)
      }
    }
  
    get orm() {
      return this._orm
    }
  
    get cache() {
      return this._cache
    }
  
    get modelName() {
      return this._modelName
    }
  
    get model() {
      return this.orm.model(this._modelName)
    }
  
    async findOne(options) {
      return await this.model.findOne(options)
    }
  
    async findMany(options) {
      return await this.model.find(options)
    }
  
    async delete(options) {
      return await this.model.deleteMany(options)
    }
  
    async create(options) {
      return await this.model.create(options)
    }
  
    async update({ query, doc }) {
      return await this.model.updateMany(query, doc)
    }
  }