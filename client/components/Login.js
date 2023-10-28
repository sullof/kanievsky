import Base from "./Base";

// eslint-disable-next-line no-undef
const { Redirect } = ReactRouterDOM;

export default class Login extends Base {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      pwd: "",
    };
    this.bindMany(["userHandler", "pwdHandler", "submitHandler"]);
  }

  userHandler(event) {
    this.setState({
      user: event.target.value,
    });
  }

  pwdHandler(event) {
    this.setState({
      pwd: event.target.value,
    });
  }

  async submitHandler(event) {
    event.preventDefault();
    const res = await this.request("v1/login", "post", undefined, {
      data: {
        user: this.state.user,
        pwd: this.state.pwd,
      },
    });
    if (res && res.success) {
      this.setStore(
        {
          accessToken: res.accessToken,
        },
        true
      );
    }
  }

  render() {
    if (this.Store.accessToken) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <h3>Login</h3>
        <form onSubmit={this.submitHandler}>
          <fieldset>
            <label htmlFor="username">Username</label>
            <input
              name="user"
              placeholder="Username"
              id="username"
              onChange={this.userHandler}
              style={{ width: 150 }}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="pwd"
              placeholder="Password"
              id="password"
              onChange={this.pwdHandler}
              style={{ width: 150 }}
            />
            <div>
              <button>Login</button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}
