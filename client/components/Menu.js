const {Link} = ReactRouterDOM
import Base from './Base'

export default class Menu extends Base {

  constructor(props) {
    super(props)

    this.state = {
      count: 0
    }

    this.updateState = this.updateState.bind(this)
    this.setBack = this.setBack.bind(this)
    this.toggleAdminMode = this.toggleAdminMode.bind(this)
    this.makeNotVisible = this.makeNotVisible.bind(this)
  }

  updateState() {
    this.setState({
      count: this.state.count + 1
    })
  }

  isMe(me) {
    if (!window.location.pathname && me === '/') {
      return 'selected'
    }
    if (window.location.pathname === me) {
      return 'selected'
    }
    return ''
  }

  setBack() {
    this.store({
      lastPath: location.pathname
    })
  }

  toggleAdminMode() {
    this.store({
      isAdminMode: !(this.Store.isAdminMode || false)
    })
  }

  makeNotVisible() {
    this.store({
      menuVisibility: false
    })
  }

  render() {
    return (
      <div className={`menu ${this.Store.menuVisibility ? 'show' : ''}`} onClick={this.updateState}>
        <div onClick={this.makeNotVisible} className={this.isMe('/')}><Link to="/">Home</Link></div>
        <div onClick={this.makeNotVisible} className={this.isMe('/bio')}><Link to="/bio">Bio</Link></div>
        <div onClick={this.makeNotVisible} className={this.isMe('/news')}><Link to="/news">News</Link></div>
        <hr/>
        <div onClick={this.makeNotVisible} className={this.isMe('/works/paintings')}><Link to="/works/paintings">Paintings</Link></div>
        <div onClick={this.makeNotVisible} className={this.isMe('/works/drawings')}><Link to="/works/drawings">Drawings</Link></div>
        <div onClick={this.makeNotVisible} className={this.isMe('/works/sculptures')}><Link to="/works/sculptures">Sculptures</Link></div>
        <hr/>
        <div onClick={this.makeNotVisible} className={this.isMe('/contacts')}><Link to="/contacts">Contacts</Link></div>
        <hr/>
        <div onClick={this.makeNotVisible}  className="admin">
          {
            this.Store.accessToken
              ? <div>
                <div>
                  {
                    this.Store.isAdminMode
                      ? <a onClick={this.toggleAdminMode} style={{fontWeight: 'bold'}}>Exit admin mode</a>
                      : <a onClick={this.toggleAdminMode} style={{fontWeight: 'bold'}}>Enter admin mode</a>

                  }
                </div>
                <div className={this.isMe('/logout')}><Link onClick={this.setBack} to="/logout">Logout</Link></div>
              </div>
              : <div className={this.isMe('/login')}><Link to="/login">Login</Link></div>
          }
        </div>
      </div>

    )
  }
}
