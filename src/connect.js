import shallowEqual from './utils/shallowEqual'
import wrapActionCreators from './utils/wrapActionCreators'
import noop from './utils/noop'

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
    let stateProps = {}
    let dispatchProps = {}
    const finalConfig = {
      onLoad: noop,
      onUnload: noop,
      didMount: noop,
      didUnMount: noop,
      ...config,
    }

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

      if (!shallowEqual(nextStateProps, stateProps)) {
        haveStatePropsChanged = true
        stateProps = nextStateProps
      }

      if (!shallowEqual(nextDispatchProps, dispatchProps)) {
        haveDispatchPropsChanged = true
        dispatchProps = nextDispatchProps
      }

      if (haveStatePropsChanged || haveDispatchPropsChanged) {
        this.setData({
          ...stateProps,
          ...dispatchProps,
        })
      }
    }

    function trySubscribe() {
      this.unsubscribe = store.subscribe(handleStoreChange.bind(this))
      handleStoreChange.call(this)
    }

    function tryUnsubscribe() {
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }
    }

    function onLoad(args) {
      trySubscribe.apply(this, args)

      if (config.onLoad) {
        config.onLoad.apply(this, args)
      }
    }

    function onUnload(args) {
      tryUnsubscribe.apply(this)

      finalConfig.onUnload.apply(this, args)
    }

    function didMount(args) {
      trySubscribe.apply(this, args)

      finalConfig.didMount.apply(this, args)
    }

    function didUnmount(args) {
      tryUnsubscribe.apply(this)

      finalConfig.didUnmount.apply(this, args)
    }

    const bindActionCreators = finalMapDispatchToProps(store.dispatch)

    return {
      ...finalConfig,
      onLoad,
      onUnload,
      didMount,
      didUnmount,
      ...bindActionCreators,
      methods: {
        ...finalConfig.methods,
        ...bindActionCreators,
      },
    }
  }
}
