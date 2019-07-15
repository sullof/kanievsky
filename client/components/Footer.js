const {Link} = ReactRouterDOM
import Base from './Base'

export default class PrimaryContent extends Base {

  render() {
    return (
      <div className="footer">
        <div className="social">
          <a className="item" target="_blank" href="https://www.instagram.com/gaelkanievsky">
            <i className="fab fa-instagram"></i>
          </a>
          <a className="item" href="https://www.pinterest.com/gaelkanievsky">
            <i className=" fab fa-pinterest"></i>
          </a>
          <a className="item" href="mailto:gael@kanievsky.com">
            <i className="fas fa-envelope-square"></i>
          </a>
          <a className="item" href="">
            <i className="fas fa-share"></i>
          </a>
        </div>
        <div className="copyright">
          &copy; 2019 Gael Kanievsky
        </div>
      </div>
    )
  }
}
