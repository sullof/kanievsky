// eslint-disable-next-line no-undef

import {isMobileOnly} from "react-device-detect";

import Case from "case";
export default class Logo extends React.Component {

  render() {

    let pathname
    let tmp = window.location.pathname.split("/");
    if (isMobileOnly && ["works"].includes(tmp[1])) {
      pathname = <div className="pathname">{Case.capital(tmp.slice(1).join(" | "))}</div>
    }


    return (
      <div className="logo">
        GAEL <br className="only-desktop" />
        KANIEVSKY
        {pathname}
      </div>
    );
  }
}
