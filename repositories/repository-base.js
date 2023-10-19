// Implement a repository by extending this class and adding methods as required.
// The class accepts a cache but implementation is up to the implementer.
export default class RepositoryBase {
    constructor({ orm, cache }, modelName) {
      this._orm = orm
      this._cache = cache
      this._modelName = modelName
  
      if (!orm[modelName]) {
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
      return this.orm[this.modelName]
    }
  
    async findOne(options) {
      return (await this.model.findMany({ ...options, ...{ take: 1 } }))[0]
    }
  
    async findMany(options) {
      return await this.model.findMany({ ...options })
    }
  
    async delete(options) {
      return await this.model.delete(options)
    }
  
    async create(options) {
      return await this.model.create(options)
    }
  
    async update(options) {
      return await this.model.update(options)
    }
  }