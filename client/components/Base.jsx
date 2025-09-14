import PropTypes from "prop-types";

import Common from "./Common.jsx";

class Base extends Common {
  constructor(props) {
    super(props);
    this.bindMany(["setStore", "request", "setTimeout", "endTimeout"]);
    this.Store = this.props.Store;
  }

  request(api, method, headers = {}, params = {}) {
    if (this.Store && this.Store.accessToken) {
      headers["Access-Token"] = this.Store.accessToken;
    }
    return super.request(api, method, headers, params);
  }

  setStore(...params) {
    this.props.setStore(...params);
  }

  setTimeout(func, time) {
    this.timerId = setTimeout(() => this.endTimeout(func), time);
  }

  endTimeout(func, time) {
    clearTimeout(this.timerId);
    this.timerId = null;
    func();
  }

  render() {
    return <div />;
  }
}

Base.propTypes = {
  Store: PropTypes.object,
  setStore: PropTypes.func,
};

export default Base;
