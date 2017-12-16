export function map (array, fn) {
  let result = []
  for (let i = 0; i < array.length; i++) {
    result[i] = fn(array[i])
  }
  return result
}

export function forEach (array, fn) {
  for (let i = 0; i < array.length; i++) {
    fn(array[i])
  }
}

export function forEach2 (a, b, fn) {
  for (let i = 0; i < a.length; i++) {
    let aItem = a[i]
    for (let j = 0; j < b.length; j++) {
      fn(aItem, b[i])
    }
  }
}

export function assert (condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

export function xor (a, b) {
  return (a || b) && !(a && b)
}