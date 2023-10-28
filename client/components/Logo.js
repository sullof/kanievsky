// eslint-disable-next-line no-undef

import {isMobileOnly} from "react-device-detect";

import Case from "case";
export default class Logo extends React.Component {

  render() {

    let pathname = window.location.pathname.substring(1).replace(/\//g, " | ");

    return (
      <div className="logo">
        GAEL <br className="only-desktop" />
        KANIEVSKY
        {isMobileOnly ?  <div className="pathname">{Case.capital(pathname)}</div> : null}
      </div>
    );
  }
}
