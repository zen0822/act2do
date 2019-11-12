/**
 * analyzing data types
 *
 * @param variable
 * @return {String} - data type.
 *
 * @example
 * type({}) // "object"
 * type([]) // "array"
 * type(5) // "number"
 * type(null) // "null"
 * type() // "undefined"
 * type(/abcd/) // "regex"
 * type(new Date()) // "date"
 */
const dataType = function (variable: any): string {
  const str = Object.prototype.toString.call(variable)

  if (str === null) {
    return 'null'
  }

  return (str as any).match(/\[object (.*?)\]/)[1].toLowerCase()
}

export {
  dataType
}
