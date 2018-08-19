import { createStore, applyMiddleware } from 'redux'
import { injectStore } from 'tinyapp-redux'
import logger from 'redux-logger'

import rootReducer from './reducers'

const initState = {
  todos: [
    { id: 1, text: 'Learning Javascript', completed: false },
    { id: 2, text: 'Learning ES2019', completed: true },
    { id: 3, text: 'Learning 支付宝小程序', completed: true },
  ],
}

const store = createStore(rootReducer, initState, applyMiddleware(logger))
injectStore(store)

App({
  ...initState,
  userInfo: null,
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo)

      my.getAuthCode({
        scopes: ['auth_user'],
        success: authcode => {
          console.info(authcode)

          my.getAuthUserInfo({
            success: res => {
              this.userInfo = res
              resolve(this.userInfo)
            },
            fail: () => {
              reject({})
            },
          })
        },
        fail: () => {
          reject({})
        },
      })
    })
  },
})
