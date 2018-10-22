import { createStore, applyMiddleware } from 'redux'
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


export default store