import isFunction from './isFunction'

export default function merge(object = {}, other = {}) {
  const finalOther = Object.keys(other).reduce((r, key) => {
    const value = object[key]
    const otherValue = other[key]

    // 如果都存在且都是函数，则先调用后者，再调用前者
    if (isFunction(value) && isFunction(otherValue)) {
      return {
        ...r,
        [key](...args) {
          otherValue.apply(this, args)
          value.apply(this, args)
        },
      }
    }

    if (typeof otherValue === 'object') {
      // 如果都存在且都是对象，则合并二者
      return {
        ...r,
        [key]: {
          ...value,
          ...otherValue,
        },
      }
    }

    // 忽略其它情况
    return {
      ...r,
      [key]: otherValue,
    }
  }, {})

  return {
    ...object,
    ...finalOther,
  }
}
