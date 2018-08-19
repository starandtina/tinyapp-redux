import { connect } from 'tinyapp-redux'

import { setVisibilityFilter } from '../../actions'

const mapStateToProps = (state, props = {}) => ({
  active: props.filter === state.visibilityFilter,
})

Component(
  connect(
    mapStateToProps,
    { setVisibilityFilter },
  )({
    mixins: [],
    data: {},
    props: {},
    methods: {
      handleFilterChange() {
        this.setVisibilityFilter(this.props.filter)
      },
    },
  }),
)
