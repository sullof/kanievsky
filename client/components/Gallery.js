import Masonry from 'react-masonry-component'
import * as Scroll from 'react-scroll'
import Base from './Base'

const masonryOptions = {
  transitionDuration: 0
}

const imagesLoadedOptions = { background: '.my-bg-image-el' }

class Gallery extends Base {

  constructor(props) {
    super(props)

    this.state = {
    }

    this.bindMany([

    ])

  }

  render() {
    const childElements = this.props.elements.map(element => {

      let caption = element.caption.split('\n').map(e => _.trim(e))
      let title = caption[0]
      caption = caption.slice(1)
      let rows = []
      for (let row of caption) {
        rows.push(<div className={'underTitle'} key={'key'+ Math.random()}>
          {row}
        </div>)
      }

      return (
        <li className="image-element-class">
          <div className="card">
            {
              this.Store.isAdminMode
                ? <Scroll.Link to={'topcontenitore'} smooth={true} duration={250} containerId="contenitore"><div className={'editButton command'} onClick={() => this.props.editPicture(element.id)}>
                  <i className="fa-solid fa-pen-to-square"/>
                </div></Scroll.Link>
                : null
            }

            <div className={'picture'}><img src={`/images/small/${element.src}`} alt={caption[0]}/></div>
            <div className={'caption'}>
              <b>{title}</b>
              {rows}
            </div>
          </div>
        </li>
      )
    })

    if (this.props.elements.length) {

      return (
        <Masonry
          className={'my-gallery-class'} // default ''
          elementType={'ul'} // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          imagesLoadedOptions={imagesLoadedOptions} // default {}
        >
          {childElements}
        </Masonry>
      )
    } else {
      return <div className={'mt120'}><h1>Whoops, this sections looks empty</h1></div>
    }
  }
}

export default Gallery
