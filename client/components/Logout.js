import Base from './Base'

const {Redirect, BrowserRouter} = ReactRouterDOM

export default class Logout extends Base {

  constructor(props) {
    super(props)
  }

  componentDidMount () {
    this.store({
      accessToken: null
    }, true)
  }

  render() {

    if (!this.Store.accessToken) {

      return <Redirect to={this.Store.lastPath}/>
    }

    return <div/>
  }
}
