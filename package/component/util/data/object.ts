import { dataType } from './data'

/**
 * to judge whether variable is Object
 *
 * @param obj
 * @return {Boolean} - whether variable is Object .
 */
const isObject = (obj: any): boolean => {
  return dataType(obj) === 'object'
}

/**
 * 判断object是否为空
 *
 * @param obj
 * @return {Boolean} - whether Object is empty .
 */
const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0
}

/**
 * deep map object without inherit
 *
 * @param obj
 * @return {Array}
 */
const deepReplaceVal = ({
  obj,
  cb
}: { obj: object, cb: Function }): object => {
  const replacedObj: Record<string, any> = {}
  const valArr = Object.values(obj)
  const keyArr = Object.keys(obj)

  valArr.forEach((val, index) => {
    if (isObject(val)) {
      replacedObj[keyArr[index]] = deepReplaceVal({
        obj: val,
        cb
      })
    } else {
      replacedObj[keyArr[index]] = cb(val)
    }
  })

  return replacedObj
}

/**
 * {a: {b: 1}} => {'a.b': 1}
 *
 * @param obj
 * @return {Array}
 */
const multiToOne = (objHub: Record<string, any>): Record<string, any> => {
  const transformObj = {}
  let prefix = ''

  const valArr = Object.values(objHub)
  const keyArr = Object.keys(objHub)

  function deep(prefix: string, obj: Record<string, any>): void {
    const valArr = Object.values(obj)
    const keyArr = Object.keys(obj)
    let objPrefix = ''

    valArr.forEach((val, index) => {
      objPrefix = `${prefix}.${keyArr[index]}`

      if (isObject(val)) {
        return deep(objPrefix, val)
      } else {
        Object.assign(transformObj, {
          [objPrefix]: val
        })
      }
    })
  }

  valArr.forEach((val, index) => {
    prefix = keyArr[index]

    if (isObject(val)) {
      return deep(prefix, val)
    } else {
      Object.assign(transformObj, {
        [prefix]: val
      })
    }
  })

  return transformObj
}

export {
  isObject,
  deepReplaceVal,
  isEmpty,
  multiToOne
}
