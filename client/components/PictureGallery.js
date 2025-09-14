// eslint-disable react/prop-types
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";
import Base from "./Base";

// eslint-disable-next-line no-undef
export default class PictureGallery extends Base {
  constructor(props) {
    super(props);
    this.state = {
      photoIndex: this.props.startIndex || 0,
      isOpen: true,
    };

    this.bindMany([]);
  }

  _onImageClick(event) {
    console.debug(
      "clicked on image",
      event.target,
      "at index",
      this._imageGallery.getCurrentIndex()
    );
  }

  _onImageLoad(event) {
    console.debug("loaded image", event.target.src);
  }

  _onImageError(event) {
    console.error("failed to load image", event.target.src);
  }

  _onScreenChange(fullScreenElement) {
    console.debug("isFullScreen?", !!fullScreenElement);
  }

  _handleInputChange(state, event) {
    if (event.target.value > 0) {
      this.setState({ [state]: event.target.value });
    }
  }

  _handleCheckboxChange(state, event) {
    this.setState({ [state]: event.target.checked });
  }

  render() {
    const { photoIndex, isOpen } = this.state;
    const images = this.props.items.map(item => item.original);

    return (
      <>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setStore({ showGallery: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
            imageTitle={this.props.items[photoIndex]?.description || ''}
            imageCaption={this.props.items[photoIndex]?.description || ''}
          />
        )}
      </>
    );
  }
}
