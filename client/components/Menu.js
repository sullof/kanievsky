const {Link} = ReactRouterDOM

export default class Menu extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      count: 0
    }

    this.updateState = this.updateState.bind(this)
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

  render() {
    return (
      <div className="menu" onClick={this.updateState}>
        <div className={this.isMe('/')}><Link to="/">Home</Link></div>
        <div className={this.isMe('/bio')}><Link to="/bio" >Bio</Link></div>
        <div className={this.isMe('/news')}><Link to="/news">News</Link></div>
        <hr/>
        <div className={this.isMe('/works/paintings')}><Link to="/works/paintings">Paintings</Link></div>
        <div className={this.isMe('/works/drawings')}><Link to="/works/drawings">Drawings</Link></div>
        <div className={this.isMe('/works/scupltures')}><Link to="/works/scupltures">Sculptures</Link></div>
        <hr/>
        <div className={this.isMe('/contacts')}><Link to="/contacts">Contacts</Link></div>
      </div>
    )
  }
}
