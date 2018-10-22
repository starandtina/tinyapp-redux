import { injectStore } from './connect'

function Provider(store) {
  injectStore(store)

  return function getConfig(config) {
    return {
      ...config,
      store,
    }
  }
}

export default Provider
