const isPromise = val => val && typeof val.then === 'function'

export default function promiseMiddleware({ dispatch, getState }) {
  return next => action => {
    const { promise, type, ...rest } = action

    // Pass to next middleware or `dispatch` if there is no `promise` passed in
    if (!promise) {
      return next(action)
    }

    // We follow the strict naming conventions
    const REQUEST = type
    const SUCCESS = `${REQUEST}_SUCCESS`
    const FAILURE = `${REQUEST}_FAILURE`

    // If `promise` is promise then use it
    // Else call it then it should return a promise object
    const actionPromise = isPromise(promise)
      ? promise
      : promise(dispatch, getState)

    /**
     * First, dispatch the `REQUEST` action.
     * Users could set the pending status for it
     */
    next({ ...rest, type: REQUEST })

    function resolve(payload) {
      const resolvedAction = {
        ...rest,
        type: SUCCESS,
        payload,
      }

      dispatch(resolvedAction)

      return { payload, action: resolvedAction }
    }

    function reject(error) {
      const rejectedAction = {
        ...rest,
        type: FAILURE,
        payload: error,
        error: true,
      }

      dispatch(rejectedAction)

      throw error
    }

    return actionPromise.then(resolve, reject)
  }
}
