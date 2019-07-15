const {BrowserRouter, Route} = ReactRouterDOM

import Menu from './components/Menu'
import Logo from './components/Logo'
import Footer from './components/Footer'
import Home from './components/Home'
import Works from './components/Works'

export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      Store: {
        example: 'QueryLatestBlock'
      },

      images: {
        paintings: [
          {
            src: '/images/8a0eae7262ad25a51bf5fd845d140b62.jpg',
            thumbnail: '/images/8a0eae7262ad25a51bf5fd845d140b62.jpg',
            thumbnailWidth: 200,
            thumbnailHeight: 200,
            caption: 'After Rain (Jeshu John - designerspics.com)'
          },
            {
              src: '/images/9556911dbfb730d4b5e826e0c9830c71.jpg',
              thumbnail: '/images/9556911dbfb730d4b5e826e0c9830c71.jpg',
              thumbnailWidth: 200,
              thumbnailHeight: 200,
              caption: 'Boats (Jeshu John - designerspics.com)'
            }
          ]
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
        />
      )
    }

    const paintings = () => {
      return (
        <Works
          Store={this.state.Store}
          setStore={this.setStore}
          images={this.state.images.paintings}
        />
      )
    }

    return <BrowserRouter>
      <div className="container">
        <div className="row">
          <div className="column">
            <Logo/>
            <Menu/>
            <Footer/>
          </div>
          <div className="column column-80">
            <Route exact path="/" component={home}/>
            <Route exact path="/works/paintings" component={paintings}/>
          </div>
        </div>
      </div>
    </BrowserRouter>
  }
}
