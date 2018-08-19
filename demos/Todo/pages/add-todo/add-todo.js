import { connect } from 'tinyapp-redux'

import { addTodo } from '../../actions'

const app = getApp()

const mapStateToProps = state => {
  return {
    ...state,
  }
}

Page(
  connect(
    mapStateToProps,
    {
      addTodo,
    },
  )({
    data: {
      inputValue: '',
    },
    onBlur(e) {
      this.setData({
        inputValue: e.detail.value,
      })
    },
    add() {
      this.addTodo(this.data.inputValue)
      my.navigateBack()
    },
  }),
)
