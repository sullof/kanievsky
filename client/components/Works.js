import qs from 'qs'
import Base from './Base'
import Dropper from './Dropper'

import Gallery from 'react-grid-gallery'

import Modal from 'react-modal'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

export default class Works extends Base {

  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false
    }

    this.bindAll([
      'onSelectImage',
      'getSelectedImages',
      'countSelected',
      'deleteImage',
      'dontDelete',
      'onClickSelectAll',
      'openModal',
      'afterOpenModal',
      'closeModal',
      'captionHandler',
      'saveNewCaption'
    ])

  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00'
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  captionHandler(event) {
    this.setState({
      caption: event.target.value
    })
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

  async editCaption() {
    const indexes = this.getSelectedImages()
    if (indexes.length === 1) {
      let image = this.state.images[indexes[0]]
      this.setState({
        thumbnail: image.thumbnail,
        caption: image.caption
      })
      this.openModal()
    } else {
     // TODO add error
    }
  }

  async saveNewCaption() {
    this.onClickSelectAll()
    this.closeModal()
    const res = await this.request(`v1/caption?${qs.stringify({
      what: this.state.what, 
      thumbnail: this.state.thumbnail,
      caption: this.state.caption
    })}`)
    if (res && res.success) {
      this.store({
        images: res.images
      })
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
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div>Edit the caption</div>
            {
              this.state.thumbnail ?
                <div>
                  <img style={{margin: 16 }} src={this.state.thumbnail}/>
                  <form>
                    <input
                      name="user" placeholder="Caption" id="caption"
                      onChange={this.captionHandler} value={this.state.caption}
                    />
                  </form>
                </div> : null
            }
            <button onClick={this.saveNewCaption}>Save</button> &nbsp;
            <button onClick={this.closeModal}>Cancel</button>
          </Modal>
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
              ?
              <div className="commands">&gt; <a onClick={() => this.deleteImage()}>Delete selected images</a> | &gt; <a
                onClick={() => this.editCaption()}>Edit caption</a> | &gt; <a onClick={() => this.onClickSelectAll()}>Unselect
                images</a></div>
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
