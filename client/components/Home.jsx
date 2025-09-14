// eslint-disable-next-line no-undef
import { isMobileOnly } from "react-device-detect";
import Base from "./Base";

export default class Home extends Base {
  componentDidMount() {
    document.body.classList.add("home");
  }

  componentWillUnmount() {
    document.body.classList.remove("home");
  }

  render() {
    return (
      <div className="primary-content">
        <div className={"logoHome"}>
          {isMobileOnly ? (
            <div>
              Gael
              <br />
              Kanievsky
            </div>
          ) : (
            <div>Gael Kanievsky</div>
          )}
        </div>
      </div>
    );
  }
}
