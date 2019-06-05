import { Provider } from 'tinyapp-redux'
import store from './createStore'

App(
  Provider(store)({
    userInfo: null,
    getUserInfo() {
      return new Promise((resolve, reject) => {
        if (this.userInfo) resolve(this.userInfo)

        resolve({
          avatar: 'http://placehold.it/48x48',
          nickName: 'starandtina',
        })
        // my.getAuthCode({
        //   scopes: ['auth_user'],
        //   success: authcode => {
        //     console.info(authcode)

        //     my.getAuthUserInfo({
        //       success: res => {
        //         this.userInfo = res
        //         resolve(this.userInfo)
        //       },
        //       fail: () => {
        //         reject({})
        //       },
        //     })
        //   },
        //   fail: () => {
        //     reject({})
        //   },
        // })
      })
    },
  }),
)
