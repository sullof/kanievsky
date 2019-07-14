import {BrowserRouter, Route} from 'react-router-dom'

const {Grid, Row, Col, Button, Badge} = ReactBootstrap

import LeftMenu from './components/LeftMenu'
import Home from './components/Home'

export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      Store: {
        example: 'QueryLatestBlock'
      }
    }
    this.setStore = this.setStore.bind(this)
  }

  setStore(newProps) {
    let store = this.state.Store
    for (let i in newProps) {
      store[i] = newProps[i]
    }
    this.setState({
      Store: store
    })
  }

  render() {

    const home = () => {
      return (
        <Home
          Store={this.state.Store}
          setStore={this.setStore}
          scrollToTop={true}
        />
      )
    }

    return <BrowserRouter>
      <Grid>
        <Row>
          <Col xs={2}><LeftMenu/></Col>
          <Col xs={10}>


          <div>
            <Route exact path="/" component={home}/>
          </div>
          </Col>
        </Row>
      </Grid>
    </BrowserRouter>
  }
}
