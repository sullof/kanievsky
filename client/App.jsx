import qs from "qs";
import * as Scroll from "react-scroll";
// eslint-disable-next-line no-undef
const { BrowserRouter, Route } = ReactRouterDOM;

import ls from "local-storage";

import Common from "./components/Common";
import Menu from "./components/Menu";
import Logo from "./components/Logo";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Works from "./components/Works";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Content from "./components/Content";
import PictureGallery from "./components/PictureGallery";

export default class App extends Common {
  constructor(props) {
    super(props);

    this.state = {
      Store: {
        content: {},
        editing: {},
        temp: {},
        menuVisibility: false,
        isAdminMode: false,
      },
      width: window.innerWidth,
      height: window.innerHeight,
      isHome: window.location.pathname.length < 2,
    };
    this.setStore = this.setStore.bind(this);
    let accessToken = ls("accessToken");
    if (accessToken) {
      if (Array.isArray(accessToken)) {
        accessToken = accessToken[0];
      }
      const deadline = parseInt(accessToken.split("$")[2]);
      if (Date.now() > deadline) {
        ls.remove("accessToken");
      } else {
        this.setStore({ accessToken, isAdminMode: true });
      }
    }

    this.bindMany([
      "updateDimensions",
      "setTimeout",
      "endTimeout",
      "checkPathname",
    ]);
  }

  setTimeout(func, time) {
    this.timerId = setTimeout(() => this.endTimeout(func), time);
  }

  endTimeout(func, time) {
    clearTimeout(this.timerId);
    this.timerId = null;
    func();
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  checkPathname() {
    let { isHome } = this.state;
    let len = window.location.pathname.length;
    if ((isHome && len > 1) || (!isHome && len < 2)) {
      this.setState({
        isHome: !isHome,
      });
    }
    this.setTimeout(this.checkPathname, 100);
  }

  async componentDidMount() {
    this.setTimeout(this.checkPathname, 100);
    window.addEventListener("resize", this.updateDimensions);
    this.request("v1/images").then((res) => {
      if (res.success) {
        this.setStore(
          {
            images: res.images,
          },
          true
        );
      }
    });
    this.request(
      `v1/content?${qs.stringify({
        what: ["bio", "news", "home", "contacts"],
      })}`
    ).then((res) => {
      if (res.success) {
        this.setStore(
          {
            content: res.content,
          },
          true
        );
      }
    });
  }

  setStore(newProps, localStorage) {
    let store = this.state.Store;
    for (let i in newProps) {
      if (newProps[i] === null) {
        if (localStorage) {
          ls.remove(i);
        }
        delete store[i];
      } else {
        if (localStorage) {
          ls(i, newProps[i]);
        }
        store[i] = newProps[i];
      }
    }
    this.setState({
      Store: store,
    });
  }

  render() {
    const setStore = this.setStore;

    const home = () => {
      return <Home Store={this.state.Store} setStore={setStore} />;
    };

    const works = (what) => {
      return () => {
        return (
          <Works Store={this.state.Store} setStore={setStore} what={what} />
        );
      };
    };

    const content = (what) => {
      return () => {
        return (
          <Content Store={this.state.Store} setStore={setStore} what={what} />
        );
      };
    };

    const login = () => {
      return <Login Store={this.state.Store} setStore={setStore} />;
    };

    const logout = () => {
      return <Logout Store={this.state.Store} setStore={setStore} />;
    };

    const rows = [];
    if (this.state.Store && this.state.Store.images) {
      let r = 0;
      for (let what in this.state.Store.images) {
        rows.push(
          <Route
            key={"route" + r++}
            exact
            path={"/works/" + what}
            component={works(what)}
          />
        );
      }
    }

    return (
      <div
        className={this.state.isHome ? "underRoot" : ""}
        style={
          this.state.isHome
            ? {
                height: this.state.height,
              }
            : {}
        }
      >
        <BrowserRouter>
          <div className="contenitore">
            <div className="row">
              <div className="column leftColumn">
                <div
                  className="menu-trigger only-mobile"
                  onClick={() =>
                    setStore({
                      menuVisibility: !this.state.Store.menuVisibility,
                    })
                  }
                >
                  <i className="fas fa-bars" />
                </div>
                <Logo />
                <Menu Store={this.state.Store} setStore={setStore} />
              </div>
              <div className="column column-100 only-mobile mpadded">
                <Route exact path="/" component={home} />
                <Route exact path="/bio" component={content("bio")} />
                <Route exact path="/news" component={content("news")} />
                {rows}
                <Route exact path="/contacts" component={content("contacts")} />
                <Route exact path="/login" component={login} />
                <Route exact path="/logout" component={logout} />
              </div>
              <div
                id="contenitore"
                className="column column-80 only-desktop wrapper"
              >
                <Scroll.Element name={"topcontenitore"} />
                <div className={"extraPadding "}>
                  <Route exact path="/" component={home} />
                  <Route exact path="/bio" component={content("bio")} />
                  <Route exact path="/news" component={content("news")} />
                  {rows}
                  <Route
                    exact
                    path="/contacts"
                    component={content("contacts")}
                  />
                  <Route exact path="/login" component={login} />
                  <Route exact path="/logout" component={logout} />
                </div>
              </div>
              <Footer mobile={true} />
            </div>
            <Footer />
          </div>
        </BrowserRouter>
        {this.state.Store.showGallery ? (
          <PictureGallery
            Store={this.state.Store}
            setStore={setStore}
            startIndex={this.state.Store.startIndex || 0}
            items={this.state.Store.galleryElements.map((element) => {
              return {
                original: `${window.location.origin}/images/large/${element.src}`,
                thumbnail: `${window.location.origin}/images/small/${element.src}`,
                description: element.caption
                  .split("\n")
                  .map((e) => _.trim(e))[0],
              };
            })}
          />
        ) : null}
      </div>
    );
  }
}
