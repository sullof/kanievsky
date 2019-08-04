import qs from 'qs'
import Base from './Base'
import Dropper from './Dropper'

import Gallery from 'react-grid-gallery'


export default class Works extends Base {

  constructor(props) {
    super(props)

    this.state = {}

    this.bindAll([
      'onSelectImage',
      'getSelectedImages',
      'countSelected',
      'deleteImage',
      'dontDelete',
      'onClickSelectAll'
    ])
  }

  componentDidMount() {
    const what = this.props.what
    this.setState({
      images: this.Store.images[what].map(e => {
        if (!this.Store.isAdminMode) {
          delete e.isSelected
        }
        return e
      }),
      what
    })
  }

  dontDelete() {
    this.setState({imagesToBeDeleted: null})
  }

  async deleteImage(confirm) {
    const what = this.state.what
    const indexes = this.getSelectedImages()
    if (confirm) {
      this.setState({imagesToBeDeleted: null})
      const res = await this.request(`v1/delete?${qs.stringify({what, indexes})}`)
      if (res && res.success) {
        this.store({
          images: res.images
        })
      }
    } else {
      const imagesToBeDeleted = []
      const images = this.Store.images[this.state.what]
      for (let i = 0; i < images.length; i++) {
        if (indexes.includes(i)) {
          imagesToBeDeleted.push(images[i].thumbnail)
        }
      }
      this.setState({imagesToBeDeleted})
    }
  }

  countSelected() {
    if (this.state.images) {
      var f = this.state.images.filter(
        function (img) {
          return img.isSelected === true
        }
      )
      return f.length
    } else {
      return 0
    }
  }

  getSelectedImages() {
    var selected = []
    for (var i = 0; i < this.state.images.length; i++)
      if (this.state.images[i].isSelected === true)
        selected.push(i)
    return selected
  }

  onSelectImage(index, image) {
    var images = this.state.images.slice()
    var img = images[index]
    if (img.hasOwnProperty('isSelected'))
      img.isSelected = !img.isSelected
    else
      img.isSelected = true

    this.setState({
      images: images
    })
  }

  thumbnailStyle() {
    return {
      cursor: 'pointer',
      marginTop: 0,
      border: '2px solid white',
      borderRadius: 2
    }
  }

  tileViewportStyle() {
    return {
      overflow: 'hidden'
    }
  }

  onClickSelectAll(selectAllChecked) {
    var images = this.state.images.slice()
    if (selectAllChecked) {
      for (let i = 0; i < this.state.images.length; i++)
        images[i].isSelected = true
    } else {
      for (let i = 0; i < this.state.images.length; i++)
        images[i].isSelected = false

    }
    this.setState({
      images: images
    })
  }

  render() {
    if (this.state.images) {
      return (
        <div>
          {
            this.state.imagesToBeDeleted
              ? <div className="confirm"><p>Are you sure you want to delete the following images?</p>
                {this.state.imagesToBeDeleted.map(e => {
                  return <img src={e} style={{width: 50, height: 50}} key={e}/>
                })}
                <div className="clearBoth"/>
                <button type="button" className="button button-small button-outline"
                        onClick={() => this.deleteImage(true)}>Yes
                </button>
                <button type="button" className="button button-small" onClick={this.dontDelete}>No</button>
              </div>
              : this.countSelected() > 0
              ? <div className="commands">&gt; <a onClick={() => this.deleteImage()}>Delete selected images</a> | &gt; <a onClick={() => this.onClickSelectAll()}>Unselect images</a></div>
              : null
          }
          <Gallery
            images={this.state.images}
            enableImageSelection={this.Store.isAdminMode ? true : false}
            showLightboxThumbnails={true}
            thumbnailStyle={this.thumbnailStyle}
            tileViewportStyle={this.tileViewportStyle}
            onSelectImage={this.onSelectImage}
          />
          {
            this.Store.isAdminMode
              ? <div style={{clear: 'both'}}>
                <Dropper
                  Store={this.props.Store}
                  setStore={this.props.setStore}
                  what={this.props.what}
                />
              </div>
              : null
          }
        </div>
      )
    } else {
      return <div/>
    }

  }
}
