import Masonry from 'react-masonry-component'
import * as Scroll from 'react-scroll'
import Base from './Base'
import PictureGallery from './PictureGallery'

const masonryOptions = {
  transitionDuration: 0
}

const imagesLoadedOptions = {background: '.my-bg-image-el'}

class Gallery extends Base {

  constructor(props) {
    super(props)

    this.state = {
      show: false,
      index: 0
    }

    this.bindMany(['showGallery'])

  }

  showGallery(startIndex) {
    console.log(startIndex)
    this.setStore({
      galleryElements: this.props.elements,
      showGallery: true,
      startIndex
    })
  }

  render() {

    const elements = this.props.elements
    for (let i =0; i< elements.length; i++) {
      elements[i].index = i
    }

    const childElements = elements.map(element => {

      let caption = element.caption.split('\n').map(e => _.trim(e))
      let title = caption[0]
      caption = caption.slice(1)
      let rows = []
      for (let row of caption) {
        rows.push(<div className={'underTitle'} key={'key' + Math.random()}>
          {row}
        </div>)
      }

      return (
        <li className="image-element-class">
          <div className="card">
            {
              this.Store.isAdminMode
                ? <Scroll.Link to={'topcontenitore'} smooth={true} duration={250} containerId="contenitore">
                  <div className={'editButton command'} onClick={() => this.props.editPicture(element.id)}>
                    <i className="fa-solid fa-pen-to-square"/>
                  </div>
                </Scroll.Link>
                : null
            }

            <div className={'picture'} onClick={() => this.showGallery(element.index)}><img src={`/images/small/${element.src}`} alt={caption[0]}/></div>
            <div className={'caption'}>
              <b>{title}</b>
              {rows
                ? <div className={'specsBlock'}>
                  <div className={'specs'}>{rows}</div>
                </div>
                : null
              }
            </div>
          </div>
        </li>
      )
    })

    if (elements.length) {

      return (
        <div><Masonry
          className={'my-gallery-class'} // default ''
          elementType={'ul'} // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          imagesLoadedOptions={imagesLoadedOptions} // default {}
        >
          {childElements}
        </Masonry>
        </div>
      )
    } else {
      return <div className={'mt120'}><h1>Whoops, this sections looks empty</h1></div>
    }
  }
}

export default Gallery
