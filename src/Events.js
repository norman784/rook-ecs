export class Events {
  constructor () {
    this._events = []
    this._eventTimes = {}
  }

  emit (event, time) {
    if (typeof event === 'string') {
      event = { type: event }
    }
    const lastTime = safeGet(this._eventTimes[event.type], time)
    event.timeDelta = (time - lastTime) / 1000
    this._eventTimes[event.type] = time
    this._events.push(event)
  }

  get (eventType) {
    return this._events.filter(
      event => event.type === eventType
    )
  }

  clear () {
    this._events.length = 0
  }
}

function safeGet (value, fallback) {
  return value !== undefined ? value : fallback
}