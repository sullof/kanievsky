import React from "react";
import Base from "./Base.jsx";
import { Navigate } from "react-router-dom";

export default class Logout extends Base {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setStore(
      {
        accessToken: null,
      },
      true
    );
  }

  render() {
    if (!this.Store.accessToken) {
      return <Navigate to={this.Store.lastPath} />;
    }

    return <div />;
  }
}
