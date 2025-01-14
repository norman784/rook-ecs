import { Entity, ComponentClass, clearNotify } from './entity'
import { Query, hasAll } from './query'

export class EntityManager {
  private changed: Entity[] = []
  private removed: Entity[] = []
  private queries: Record<string, Query> = {
    '': new Query(() => true, []),
  }

  query = (...components: ComponentClass<any>[]): readonly Entity[] => {
    const queryId = getQueryId(components)
    if (!this.queries[queryId]) {
      this.queries[queryId] = new Query(
        hasAll(components),
        this.queries[''].entities,
      )
    }
    return this.queries[queryId].entities
  }

  scheduleUpdate = (entity: Entity) => this.changed.push(entity)
  scheduleRemove = (entity: Entity) => this.removed.push(entity)

  processUpdates () {
    for (const query of Object.values(this.queries)) {
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
  return components.map(component => component.type).sort().join('+')
}
