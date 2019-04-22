import shallowEqual from './utils/shallowEqual'
import wrapActionCreators from './utils/wrapActionCreators'
import merge from './utils/merge'

const defaultMapStateToProps = () => ({})
const defaultMapDispatchToProps = dispatch => ({ dispatch })
let store

export const injectStore = tinyAppStore => {
  store = tinyAppStore
}

export default function connect(
  mapStateToProps = defaultMapStateToProps,
  mapDispatchToProps = defaultMapDispatchToProps,
) {
  let finalMapDispatchToProps

  if (typeof mapDispatchToProps === 'function') {
    finalMapDispatchToProps = mapDispatchToProps
  } else {
    finalMapDispatchToProps = wrapActionCreators(mapDispatchToProps)
  }

  return function withConnect(config) {
    const { pure = true } = config
    function handleStoreChange() {
      if (!this.unsubscribe) {
        return
      }

      let haveStatePropsChanged = false
      let haveDispatchPropsChanged = false

      const currentState = store.getState()
      const nextStateProps = mapStateToProps(currentState, this.props)
      const nextDispatchProps = finalMapDispatchToProps(
        store.dispatch,
        this.props,
      )

      if (!pure || !shallowEqual(nextStateProps, this.stateProps)) {
        haveStatePropsChanged = true
        this.stateProps = nextStateProps
      }

      if (!pure || !shallowEqual(nextDispatchProps, this.dispatchProps)) {
        haveDispatchPropsChanged = true
        this.dispatchProps = nextDispatchProps
      }

      if (haveStatePropsChanged || haveDispatchPropsChanged) {
        this.setData({
          ...this.stateProps,
          ...this.dispatchProps,
        })
      }
    }

    function trySubscribe() {
      this.stateProps = {};
      this.dispatchProps = {}
      this.unsubscribe = store.subscribe(handleStoreChange.bind(this))
      handleStoreChange.call(this)
    }

    function tryUnsubscribe() {
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }
    }

    function onLoad(...args) {
      trySubscribe.apply(this, args)
    }

    function onUnload(...args) {
      this.stateProps = null
      this.dispatchProps = null
      tryUnsubscribe.apply(this, args)
    }

    function didMount(...args) {
      trySubscribe.apply(this, args)
    }

    function didUnmount(...args) {
      this.stateProps = null
      this.dispatchProps = null
      tryUnsubscribe.apply(this, args)
    }

    const bindActionCreators = {
      ...finalMapDispatchToProps(store.dispatch),
      dispatch: store.dispatch,
    }

    return merge(config, {
      onLoad,
      onUnload,
      didMount,
      didUnmount,
      ...bindActionCreators, // bind action creators on `this`
      methods: bindActionCreators, // merge with Component.methods
    })
  }
}
