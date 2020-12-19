import Base from './Base'
import ReactQuill from 'react-quill'

export default class Content extends Base {

  constructor(props) {
    super(props)
    this.state = {}
    this.bindAll([
      'handleChange',
      'editPage',
      'saveChanges',
      'cancelChanges',
      'getData'
    ])
  }

  getData() {
    return {
      editing: this.Store.editing,
      content: this.Store.content,
      temp: this.Store.temp,
      what: this.props.what
    }
  }

  async saveChanges() {
    const {editing, content, temp, what} = this.getData()
    const previous = content[what]
    content[what] = this.state.text
    editing[what] = null
    const res = await this.request('v1/save', 'post', null, {
      data: {
        what,
        content: content[what]
      }
    })
    if (res && res.success) {
      temp[what] = null
      this.store({
        editing,
        content,
        temp
      })
    } else {
      temp[what] = null
      content[what] = previous
      this.store({
        editing,
        content,
        temp
      })
    }
  }

  cancelChanges() {
    const {editing, temp, what} = this.getData()
    editing[what] = null
    temp[what] = null
    this.store({
      editing,
      temp
    })
    this.setState({
      text: ''
    })
  }

  componentWillUnmount() {
    if (this.state.text) {
      const {temp, what} = this.getData()
      temp[what] = this.state.text
      this.store({
        temp
      })
    }
  }

  editPage() {
    const {editing, content, temp, what} = this.getData()
    editing[what] = true
    temp[what] = content[what]
    this.store({
      editing,
      temp
    })
    this.setState({
      text: content[what]
    })
  }

  handleChange(value) {
    this.setState({
      text: value
    })
  }

  async componentDidMount() {
    const {content, temp, what} = this.getData()
    if (temp[what]) {
      this.setState({
        text: temp[what]
      })
    } else {
      this.setState({
        text: content[what]
      })
    }
  }


  render() {
    return (
      <div>
        {
          this.Store.isAdminMode
            ? (
              this.Store.editing[this.props.what]
                ? <div><ReactQuill value={this.state.text}
                                   onChange={this.handleChange}/>
                  <div className="underEditor">
                    <button type="button" onClick={this.saveChanges}>Save changes</button>
                    <button type="button" onClick={this.cancelChanges} className="button button-outline">Cancel</button>
                  </div>
                </div>
                : <div className="commands">&gt; <a onClick={this.editPage}>Edit this page</a></div>
            )
            : null
        }
        {
          this.Store.isAdminMode && this.Store.editing[this.props.what] ? null :
            <div dangerouslySetInnerHTML={{
              __html:
                this.Store
                  ? this.Store.content[this.props.what]
                  : '<div/>'
            }}/>
        }

      </div>
    )
  }
}

