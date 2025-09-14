import Base from "./Base";

// eslint-disable-next-line no-undef
const { Redirect } = ReactRouterDOM;

export default class Logout extends Base {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setStore(
      {
        accessToken: null,
        isAdminMode: false,
      },
      true
    );
  }

  render() {
    if (!this.Store.accessToken) {
      return <Redirect to={this.Store.lastPath} />;
    }

    return <div />;
  }
}
