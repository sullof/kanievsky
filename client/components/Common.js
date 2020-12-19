import ls from 'local-storage'
import clientApi  from '../utils/ClientApi'

// eslint-disable-next-line no-undef
export default class Common extends React.Component {

  constructor(props) {
    super(props)

    this.bindAll = this.bindAll.bind(this)
    this.ls = ls
  }

  request(api, method, headers = {}, params = {}) {
    if (this.store && this.store.accessToken) {
      headers.accessToken = this.store.accessToken
    }
    return clientApi.request(api, method, headers, params)
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

