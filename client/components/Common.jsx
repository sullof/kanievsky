import React from "react";
import ls from "local-storage";
import clientApi from "../utils/ClientApi";

export default class Common extends React.Component {
  constructor(props) {
    super(props);

    this.bindMany = this.bindMany.bind(this);
    this.ls = ls;
  }

  request(api, method, headers = {}, params = {}) {
    // if (this.Store && this.Store.accessToken) {
    //   headers.accessToken = this.Store.accessToken
    // }
    return clientApi.request(api, method, headers, params);
  }

  bindMany(methods) {
    for (let m of methods) {
      this[m] = this[m].bind(this);
    }
  }

  render() {
    return <div />;
  }
}
