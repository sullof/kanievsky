// eslint-disable-next-line no-undef
const { Link } = ReactRouterDOM;
import Base from "./Base";

export default class Menu extends Base {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };

    this.bindMany([
      "handleSection",
      "handleSubmit",
      "updateState",
      "setBack",
      "toggleAdminMode",
      "makeNotVisible",
    ]);
  }

  updateState() {
    this.setState({
      count: this.state.count + 1,
    });
  }

  isMe(me) {
    if (!window.location.pathname && me === "/") {
      return "selected";
    }
    if (window.location.pathname === me) {
      return "selected";
    }
    return "";
  }

  setBack() {
    this.setStore({
      lastPath: location.pathname,
    });
  }

  toggleAdminMode() {
    this.setStore({
      isAdminMode: !(this.Store.isAdminMode || false),
    });
  }

  makeNotVisible() {
    this.setStore({
      menuVisibility: false,
    });
  }

  capitalize(str) {
    return (str.substring(0, 1).toUpperCase() + str.substring(1)).replace(
      /([a-z]{1})([A-Z]{1})/g,
      "$1 $2"
    );
  }

  handleSection(event) {
    this.setState({
      section: event.target.value,
    });
  }

  async handleSubmit() {
    const { images } = this.Store;
    let section = (this.state.section || "").toLowerCase();
    if (images[section]) {
      return this.setState({
        section: "",
      });
    }
    const res = await this.request("v1/new-section", "post", undefined, {
      data: {
        section,
      },
    });
    if (res && res.success) {
      images[section] = [];
      this.setStore({ images });
      this.setState({
        section: "",
      });
    }
  }

  render() {
    const { section } = this.state;
    const rows = [];
    if (this.Store.images) {
      for (let what in this.Store.images) {
        rows.push(
          <div
            onClick={this.makeNotVisible}
            className={this.isMe("/works/" + what)}
          >
            <Link to={"/works/" + what}>{this.capitalize(what)}</Link>
          </div>
        );
      }
    }

    return (
      <div
        className={`menu ${this.Store.menuVisibility ? "show" : ""}`}
        onClick={this.updateState}
      >
        <div onClick={this.makeNotVisible} className={this.isMe("/")}>
          <Link to="/">Home</Link>
        </div>
        <div onClick={this.makeNotVisible} className={this.isMe("/bio")}>
          <Link to="/bio">Bio</Link>
        </div>
        <div onClick={this.makeNotVisible} className={this.isMe("/news")}>
          <Link to="/news">News</Link>
        </div>
        <hr />
        {rows}
        {this.Store.isAdminMode ? (
          <div className={"newSection"}>
            Add a new section
            <div>
              <input
                name="section"
                placeholder="Section"
                id="section"
                onChange={this.handleSection}
                style={{ width: 100 }}
              />{" "}
              <button
                type={"button"}
                disabled={!section}
                onClick={this.handleSubmit}
              >
                Add
              </button>
            </div>
          </div>
        ) : null}
        <hr />
        <div onClick={this.makeNotVisible} className={this.isMe("/contacts")}>
          <Link to="/contacts">Contacts</Link>
        </div>
        <div
          onClick={this.makeNotVisible} //className="admin"
        >
          {this.Store.accessToken ? (
            <div>
              <div className={this.isMe("/logout")}>
                <Link onClick={this.setBack} to="/logout">
                  Logout
                </Link>
              </div>
              <div className={"mt20"}>
                {this.Store.isAdminMode ? (
                  <a
                    onClick={this.toggleAdminMode}
                    style={{ fontSize: "90%", color: "darkmagenta" }}
                  >
                    Exit admin mode
                  </a>
                ) : (
                  <a
                    onClick={this.toggleAdminMode}
                    style={{ fontSize: "90%", color: "darkmagenta" }}
                  >
                    Enter admin mode
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className={this.isMe("/login")}>
              <Link to="/login">Login</Link>
            </div>
          )}
        </div>
      </div>
    );
  }
}
