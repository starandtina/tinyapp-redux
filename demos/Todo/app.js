import { Provider } from 'tinyapp-redux'
import store from './createStore'

App(
  Provider(store)({
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
  }),
)
