import { connect } from 'tinyapp-redux'

import {
  toggleTodo,
  setVisibilityFilter,
  VisibilityFilters,
} from '../../actions'
import { getVisibleTodos } from '../../reducers'

const app = getApp()
const mapStateToProps = state => ({
  // getVisibleTodos encapsulates all the knowledge about the application state shape,
  // so we can just pass it the whole state of our application
  // and it will figure out how to select the visible todos according to the logic described in our selector
  todos: getVisibleTodos(state, state.visibilityFilter),
})

Page(
  connect(
    mapStateToProps,
    { toggleTodo },
  )({
    data: { VisibilityFilters },
    onLoad() {
      app.getUserInfo().then(user =>
        this.setData({
          user,
        }),
      )
    },
    onTodoChanged(e) {
      this.toggleTodo(e.target.dataset.id)
    },
    addTodo() {
      my.navigateTo({ url: '../add-todo/add-todo' })
    },
  }),
)
