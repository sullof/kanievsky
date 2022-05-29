// eslint-disable react/prop-types
import ImageGallery from 'react-image-gallery'
import Base from './Base'

// eslint-disable-next-line no-undef
export default class PictureGallery extends Base {

  constructor(props) {
    super(props)
    this.state = {
      showIndex: false,
      showBullets: true,
      infinite: true,
      showThumbnails: false,
      showFullscreenButton: true,
      showGalleryFullscreenButton: true,
      showPlayButton: true,
      showGalleryPlayButton: true,
      showNav: true,
      isRTL: false,
      slideDuration: 450,
      slideInterval: 2000,
      slideOnThumbnailOver: false,
      thumbnailPosition: 'bottom',
      showVideo: {},
      useWindowKeyDown: true,
    }

    this.bindMany([])
  }


  _onImageClick(event) {
    console.debug('clicked on image', event.target, 'at index', this._imageGallery.getCurrentIndex());
  }

  _onImageLoad(event) {
    console.debug('loaded image', event.target.src);
  }

  _onScreenChange(fullScreenElement) {
    console.debug('isFullScreen?', !!fullScreenElement);
  }

  _handleInputChange(state, event) {
    if (event.target.value > 0) {
      this.setState({[state]: event.target.value});
    }
  }

  _handleCheckboxChange(state, event) {
    this.setState({[state]: event.target.checked});
  }

  render() {

    return <div>
      <div className={'closeButton'}><div onClick={() => this.setStore({showGallery: false})}><i className="fa-solid fa-rectangle-xmark"/></div></div>

      <ImageGallery
        startIndex={this.props.startIndex}
        items={this.props.items}
        ref={i => this._imageGallery = i}
        onClick={this._onImageClick.bind(this)}
        onImageLoad={this._onImageLoad}
        onScreenChange={this._onScreenChange.bind(this)}
        infinite={this.state.infinite}
        showBullets={this.state.showBullets}
        showFullscreenButton={this.state.showFullscreenButton && this.state.showGalleryFullscreenButton}
        showPlayButton={this.state.showPlayButton && this.state.showGalleryPlayButton}
        showThumbnails={this.state.showThumbnails}
        showIndex={this.state.showIndex}
        showNav={this.state.showNav}
        additionalClass="app-image-gallery"
        useWindowKeyDown={this.state.useWindowKeyDown}
      />
    </div>
  }
}
