import Base from './Base'
import qs from 'qs'

export default class Dropper extends Base {

  constructor(props) {
    super(props)

    this.state = {
      selectedFile: null,
      loaded: 0
    }

    this.bindAll([
      'checkMimeType',
      'maxSelectFile',
      'checkFileSize',
      'onChangeHandler',
      'onClickHandler',
      'captionHandler'
    ])
  }


  captionHandler(event) {
    this.setState({
      caption: event.target.value
    })
  }

  checkMimeType(event) {
    let files = event.target.files
    let err = []
    const types = ['image/png', 'image/jpeg', 'image/gif']
    for (var x = 0; x < files.length; x++) {
      if (types.every(type => files[x].type !== type)) {
        err[x] = files[x].type + ' is not a supported format\n'
      }
    }
    for (var z = 0; z < err.length; z++) {
      this.setError('Wrong format. Accepted: gif, jpg and png')
      event.target.value = null
    }
    return true
  }

  maxSelectFile(event) {
    let files = event.target.files
    if (files.length > 1) {
      const msg = 'Only 3 images can be uploaded at a time'
      event.target.value = null
      console.warn(msg)
      return false
    }
    return true
  }

  checkFileSize(event) {
    let files = event.target.files
    let size = 4000000
    let err = []
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + 'is too large, please pick a smaller file\n'
      }
    }
    for (var z = 0; z < err.length; z++) {// if message not same old that mean has error
      event.target.value = null
      this.setError('Image too large.')
    }
    return true
  }

  onChangeHandler(event) {
    var files = event.target.files
    if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
      // if return true allow to setState
      this.setState({
        selectedFile: files,
        loaded: 0
      })
    }
  }

  setError(msg) {
    this.setState({
      error: msg
    })
    setTimeout(() => {
      this.setState({
        error: null
      })
    }, 3000)
  }

  onClickHandler() {
    const data = new FormData()
    for (var x = 0; x < this.state.selectedFile.length; x++) {
      data.append('file', this.state.selectedFile[x])
    }
    this.request(`v1/upload?${qs.stringify({
      caption: this.state.caption || '',
      what: this.props.what
    })}`, 'post', {}, {
      data,
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
        })
      }
    })
      .then(res => { // then print response status
        const {newImage, what} = res
        const images = this.Store.images
        if (!images[what]) {
          images[what] = []
        }
        images[what].push(newImage)
        this.store({
          images
        })
      })
      .catch(err => { // then print response status
        this.setError('Upload failed.')
      })
  }

  render() {
    return (
      <div className="form-group files clearBoth">
        <label>Drop here a new picture or click </label>
        <input type="file" className="form-control" multiple onChange={this.onChangeHandler}/>
        <div className="clearBoth">&nbsp;</div>
        <label htmlFor="caption">Caption</label>
        <input
          name="user" placeholder="Caption" id="caption"
          onChange={this.captionHandler}
        />
        {
          this.state.error
            ? <div className="error">{this.state.error}</div>
            : null
              }
        <button type="button" onClick={this.onClickHandler}
                style={{clear: 'both'}}>Upload
        </button>
      </div>
    )
  }
}

