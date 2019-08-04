
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Topics from './Topics'

const Content = () => (
    <BrowserRouter>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </div>
    </BrowserRouter>
)

export default Content
