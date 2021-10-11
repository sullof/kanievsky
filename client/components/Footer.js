import Base from './Base'

export default class PrimaryContent extends Base {

  render() {
    return (
      <div className={`footer ${this.props.mobile ? 'only-mobile' : 'only-desktop'}`}>
        <div className="social">
          <a className="item" target="_blank" href="https://www.instagram.com/gaelkanievsky">
            <i className="fab fa-instagram"/>
          </a>
          <a className="item" href="https://www.pinterest.com/gaelkanievsky">
            <i className=" fab fa-pinterest"/>
          </a>
          <a className="item" href="mailto:gael@kanievsky.com">
            <i className="fas fa-envelope-square"/>
          </a>
        </div>
        <div className="copyright">
          &copy; {(new Date).getFullYear()} Gael Kanievsky
        </div>
      </div>
    )
  }
}
