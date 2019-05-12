import { Entity, ComponentClass, clearNotify } from './entity'
import { Query, hasAll } from './query'

export class EntityManager {
  private changed: Entity[] = []
  private removed: Entity[] = []
  private queryAll = new Query(() => true, [])
  private queries: Query[] = [this.queryAll]
  private queryMap = new Map<string, Query>()

  query = (...components: ComponentClass<any>[]): Entity[] => {
    const queryId = getQueryId(components)
    const existingQuery = this.queryMap.get(queryId)
    if (existingQuery) {
      return existingQuery.entities
    } else {
      const newQuery = new Query(
        hasAll(components),
        this.queryAll.entities,
      )
      this.queryMap.set(queryId, newQuery)
      this.queries.push(newQuery)
      return newQuery.entities
    }
  }

  scheduleUpdate = (entity: Entity) => this.changed.push(entity)
  scheduleRemove = (entity: Entity) => this.removed.push(entity)

  processUpdates () {
    for (const query of this.queries) {
      this.changed.forEach(entity => query.onChange(entity))
      this.removed.forEach(entity => query.onRemove(entity))
    }
    this.changed.forEach(clearNotify)
    this.changed.length = 0
    this.removed.forEach(clearNotify)
    this.removed.length = 0
  }
}

function getQueryId (components: ComponentClass<any>[]) {
  return components.map(component => component.type).sort().join(' ')
}