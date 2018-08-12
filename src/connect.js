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
  options = {},
) {
  const finalMapDispatchToProps = wrapActionCreators(mapDispatchToProps)

  let stateProps = {}
  let dispatchProps = {}
  const finalOptions = {
    onLoad: noop,
    onUnload: noop,
    didMount: noop,
    didUnMount: noop,
    ...options,
  }

  function handleStoreChange() {
    if (!this.unsubscribe) {
      return
    }

    let haveStatePropsChanged = false
    let haveDispatchPropsChanged = false

    const currentState = store.getState()
    const nextStateProps = mapStateToProps(currentState, this.props)
    const nextDispatchProps = finalMapDispatchToProps(store.dispatch)

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

    if (options.onLoad) {
      options.onLoad.apply(this, args)
    }
  }

  function onUnload(args) {
    tryUnsubscribe.apply(this)

    finalOptions.onUnload.apply(this, args)
  }

  function didMount(args) {
    trySubscribe.apply(this, args)

    finalOptions.didMount.apply(this, args)
  }

  function didUnmount(args) {
    tryUnsubscribe.apply(this)

    finalOptions.didUnmount.apply(this, args)
  }

  return {
    ...finalOptions,
    onLoad,
    onUnload,
    didMount,
    didUnmount,
  }
}
