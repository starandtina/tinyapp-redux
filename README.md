Tiny App Redux
=========================

Tiny App bindings for [Redux](https://github.com/reduxjs/redux).

## Installation

```
npm install --save tinyapp-redux
```

## How Does It Work?

### 1、`injectStore`

```JavaScript
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

App({
  ...initState,
  userInfo: null,
  onLaunch() {
    this.store = createStore(rootReducer, initState, applyMiddleware(logger))

    injectStore(this.store) // inject the store into the tiny app
  },
})
```

### 2、Connect your Page or Components

```JavaScript
import { connect } from 'tinyapp-redux'

import {
  toggleTodo,
  setVisibilityFilter,
  VisibilityFilters,
} from '../../actions'
import { getVisibleTodos } from '../../reducers'

const mapStateToProps = state => ({
  todos: getVisibleTodos(state, state.visibilityFilter),
})

Page(
  connect(
    mapStateToProps,
    { toggleTodo },
    {
      data: { VisibilityFilters },
      onTodoChanged(e) {
        this.data.toggleTodo(e.target.dataset.id)
      },
      addTodo() {
        my.navigateTo({ url: '../add-todo/add-todo' })
      },
    },
  ),
)

```

## Demos

- [x] Todo
- [] Counter
- [] Async

## License

MIT
