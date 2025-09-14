import React from "react";
import Base from "./Base.jsx";
import qs from "qs";

export default class Dropper extends Base {
  constructor(props) {
    super(props);

    this.state = {
      selectedFile: null,
      loaded: 0,
      id: "",
      caption: "",
    };

    this.bindMany([
      "checkMimeType",
      "maxSelectFile",
      "checkFileSize",
      "onChangeHandler",
      "onClickHandler",
      "captionHandler",
      "triggerEdit",
    ]);
  }

  componentDidMount() {
    this.props.register(this.triggerEdit);
  }

  triggerEdit(image) {
    this.setState({
      previewSrc: "/images/large/" + image.src,
      caption: image.caption,
      id: image.id,
      selectedFile: null,
    });
  }

  captionHandler(event) {
    this.setState({
      caption: event.target.value,
    });
  }

  checkMimeType(event) {
    let files = event.target.files;
    let err = [];
    const types = ["image/png", "image/jpeg", "image/gif"];
    for (var x = 0; x < files.length; x++) {
      if (types.every((type) => files[x].type !== type)) {
        err[x] = files[x].type + " is not a supported format\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      this.setError("Wrong format. Accepted: gif, jpg and png");
      event.target.value = null;
    }
    return true;
  }

  maxSelectFile(event) {
    let files = event.target.files;
    if (files.length > 1) {
      const msg = "You can uploaded one image at a time";
      event.target.value = null;
      console.warn(msg);
      return false;
    }
    return true;
  }

  checkFileSize(event) {
    let files = event.target.files;
    let size = 4000000;
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + "is too large, please pick a smaller file\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      event.target.value = null;
      this.setError("Image too large.");
      break;
    }
    return true;
  }

  onChangeHandler(event) {
    var files = event.target.files;
    if (
      this.maxSelectFile(event) &&
      this.checkMimeType(event) &&
      this.checkFileSize(event)
    ) {
      // if return true allow to setState
      this.setState({
        selectedFile: files,
        previewSrc: URL.createObjectURL(files[0]),
        loaded: 0,
      });
    }
  }

  setError(msg) {
    this.setState({
      error: msg,
    });
    setTimeout(() => {
      this.setState({
        error: null,
      });
    }, 3000);
  }

  async deleteThis(confirm) {
    const what = this.state.what;
    if (confirm) {
      this.setState({ imagesToBeDeleted: null });
      const res = await this.request(`v1/delete?id=${this.state.id}`, "delete");
      if (res && res.success) {
        const images = this.Store.images;
        for (let i = 0; i < images[what].length; i++) {
          if (images[what][i].id === parseInt(this.state.id)) {
            images[what].splice(i, 1);
            break;
          }
        }
        this.setStore({
          images,
        });
      }
    } else {
      this.setState({
        areYouSure: true,
      });
    }
  }

  async onClickHandler() {
    const data = new FormData();
    let ok;
    if (this.state.selectedFile) {
      for (var x = 0; x < this.state.selectedFile.length; x++) {
        data.append("file", this.state.selectedFile[x]);
        ok = true;
      }
    }
    const res = await this.request(
      `v1/upload?${qs.stringify({
        caption: this.state.caption || "",
        what: this.props.what,
        id: this.state.id,
      })}`,
      "post",
      undefined,
      ok
        ? {
            data,
            onUploadProgress: (ProgressEvent) => {
              this.setState({
                loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
              });
            },
          }
        : undefined
    );
    const { newImage, what } = res;
    if (newImage) {
      const images = this.Store.images;
      if (!images[what]) {
        images[what] = [];
      }
      if (this.state.id) {
        for (let img of images[what]) {
          if (img.id === parseInt(this.state.id)) {
            img.src = newImage.src;
            img.caption = newImage.caption;
          }
        }
      } else {
        images[what].splice(0, 0, newImage);
      }
      this.setStore({
        images,
      });
    }
  }

  render() {
    let { error, previewSrc, caption, id, areYouSure } = this.state;
    return (
      <div className="form-group files clearBoth">
        <div className="row">
          <div className="column">
            <label>Drop here a new picture or click </label>
            <input
              type="file"
              className="form-control"
              onChange={this.onChangeHandler}
            />
            <div className="clearBoth">&nbsp;</div>
            <label htmlFor="caption">Caption</label>
            <textarea
              placeholder={`Title
Year
Tecnique, size`}
              id="caption"
              onChange={this.captionHandler}
              defaultValue={caption}
            />
            {error ? <div className="error">{this.state.error}</div> : null}
            <button
              type="button"
              onClick={this.onClickHandler}
              style={{ clear: "both" }}
            >
              Upload
            </button>
            {id ? (
              <div className={"floatRight"}>
                {areYouSure ? <b>Are you sure? </b> : null}

                <button
                  type={"button"}
                  onClick={() => this.deleteThis(true)}
                  className={"cancel"}
                >
                  {areYouSure ? "Yes, do it" : "Delete this picture"}
                </button>
                {areYouSure ? (
                  <span>
                    {" "}
                    <button
                      type={"button"}
                      onClick={() => {
                        this.setState({
                          areYouSure: null,
                        });
                      }}
                    >
                      No
                    </button>
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="column">
            {previewSrc ? <img src={previewSrc} alt={""} /> : null}
          </div>
        </div>
      </div>
    );
  }
}
