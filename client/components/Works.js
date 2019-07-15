import Base from './Base'

import Gallery from 'react-grid-gallery'

export default class Works extends Base {


  render() {

    return (
      <Gallery
        images={this.props.images}
        enableImageSelection={false}
        showLightboxThumbnails={true}
        />
    )
  }
}
