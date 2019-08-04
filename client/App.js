import qs from 'qs'
const {BrowserRouter, Route} = ReactRouterDOM
import ls from 'local-storage'

import Common from './components/Common'
import Menu from './components/Menu'
import Logo from './components/Logo'
import Footer from './components/Footer'
import Home from './components/Home'
import Works from './components/Works'
import Login from './components/Login'
import Logout from './components/Logout'
import Content from './components/Content'

export default class App extends Common {

  constructor(props) {
    super(props)

    this.state = {
      Store: {
        content: {},
        editing: {},
        temp: {}
      }
    }
    this.setStore = this.setStore.bind(this)
    let accessToken = ls('accessToken')
    if (accessToken) {
      if (Array.isArray(accessToken)) {
        accessToken = accessToken[0]
      }
      const deadline = parseInt(accessToken.split('$')[2])
      if (Date.now() > deadline) {
        ls.remove('accessToken')
      } else {
        this.setStore({accessToken})
      }
    }
  }

  async componentDidMount() {
    this.request('v1/images')
      .then(res => {
        if (res.success) {
          this.setStore({
            images: res.images
          }, true)
        }
      })
    this.request(`v1/content?${qs.stringify({
      what: ['bio', 'news', 'home', 'contacts'].join(',')
    })}`)
      .then(res => {
        if (res.success) {
          this.setStore({
            content: res.content
          }, true)
        }
      })
  }

  setStore(newProps, localStorage) {
    let store = this.state.Store
    for (let i in newProps) {
      if (newProps[i] === null) {
        if (localStorage) {
          ls.remove(i)
        }
        delete store[i]
      } else {
        if (localStorage) {
          ls(i, newProps[i])
        }
        store[i] = newProps[i]
      }
    }
    this.setState({
      Store: store
    })
  }

  render() {

    const home = () => {
      return (
        <Home
          Store={this.state.Store}
          setStore={this.setStore}
        />
      )
    }

    const works = (what) => {
      return () => {
        return (
          <Works
            Store={this.state.Store}
            setStore={this.setStore}
            what={what}
          />
        )
      }
    }


    const content = (what) => {
      return () => {
        return (
          <Content
            Store={this.state.Store}
            setStore={this.setStore}
            what={what}
          />
        )
      }
    }

    const login = () => {
      return (
        <Login
          Store={this.state.Store}
          setStore={this.setStore}
        />
      )
    }

    const logout = () => {
      return (
        <Logout
          Store={this.state.Store}
          setStore={this.setStore}
        />
      )
    }


    return <BrowserRouter>
      <div className="container">
        <div className="row">
          <div className="column">
            <Logo/>
            <Menu
              Store={this.state.Store}
              setStore={this.setStore}
            />
            <Footer/>
          </div>
          <div className="column column-80">
            <Route exact path="/" component={home}/>
            <Route exact path="/bio" component={content('bio')}/>
            <Route exact path="/news" component={content('news')}/>
            {
              this.state.Store.images ? <div>
              <Route exact path="/works/paintings" component={works('paintings')}/>
              <Route exact path="/works/sculptures" component={works('sculptures')}/>
              <Route exact path="/works/drawings" component={works('drawings')}/>
              </div>
                : <div/>
            }
            <Route exact path="/contacts" component={content('contacts')}/>
            <Route exact path="/login" component={login}/>
            <Route exact path="/logout" component={logout}/>
          </div>
        </div>
      </div>
    </BrowserRouter>
  }
}
