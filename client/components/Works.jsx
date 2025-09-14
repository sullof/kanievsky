import React from "react";
import Base from "./Base.jsx";
import Dropper from "./Dropper.jsx";
import Gallery from "./Gallery.jsx";

export default class Works extends Base {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
    };

    this.bindMany([
      "countSelected",
      "captionHandler",
      "editPicture",
      "register",
    ]);
  }

  captionHandler(event) {
    this.setState({
      caption: event.target.value,
    });
  }

  componentDidMount() {
    const what = this.props.what;
    this.setState({
      images: this.Store.images[what].map((e) => {
        if (!this.Store.isAdminMode) {
          delete e.isSelected;
        }
        return e;
      }),
      what,
    });
  }

  countSelected() {
    if (this.state.images) {
      var f = this.state.images.filter(function (img) {
        return img.isSelected === true;
      });
      return f.length;
    } else {
      return 0;
    }
  }

  editPicture(imageId) {
    if (this.Store.isAdminMode) {
      for (let image of this.state.images) {
        if (image.id === imageId) {
          this.triggerEdit(image);
          break;
        }
      }
    }
  }

  register(triggerEdit) {
    this.triggerEdit = triggerEdit;
  }

  render() {
    if (this.state.images) {
      return (
        <div>
          {this.Store.isAdminMode ? (
            <Dropper
              Store={this.Store}
              setStore={this.setStore}
              what={this.props.what}
              editNow={this.state.editNow}
              register={this.register}
            />
          ) : null}
          <Gallery
            Store={this.Store}
            setStore={this.setStore}
            elements={this.state.images}
            editPicture={this.editPicture}
          />
        </div>
      );
    } else {
      return <div />;
    }
  }
}
