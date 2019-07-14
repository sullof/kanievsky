
import clientApi  from '../utils/ClientApi'
import PropTypes from 'prop-types'

class Base extends React.Component {

  constructor(props) {
    super(props)

    this.bindAll = this.bindAll.bind(this)
    this.bindAll([
      'store'
    ])
    this.Store = this.props.Store
  }

  store(data) {
    this.props.setStore(data)
  }


  fetch(api, method, body) {
    return clientApi.fetch(api, method, body)
  }

  bindAll(methods) {
    for (let m of methods) {
      this[m] = this[m].bind(this)
    }
  }

  render() {
    return <div/>
  }
}

Base.propTypes = {
  Store: PropTypes.object,
  setStore: PropTypes.func
}

export default Base
