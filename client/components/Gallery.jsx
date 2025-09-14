import React from "react";
import * as Scroll from "react-scroll";
import Base from "./Base.jsx";
import { isMobileOnly } from "react-device-detect";

class Gallery extends Base {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      index: 0,
    };

    this.bindMany(["showGallery"]);
  }

  showGallery(startIndex) {
    // console.log(startIndex);
    this.setStore({
      galleryElements: this.props.elements,
      showGallery: true,
      startIndex,
    });
  }

  render() {
    const elements = this.props.elements;
    for (let i = 0; i < elements.length; i++) {
      elements[i].index = i;
    }

    const childElements = elements.map((element) => {
      let caption = element.caption.split("\n").map((e) => _.trim(e));
      let title = caption[0];
      caption = caption.slice(1);
      let rows = isMobileOnly
        ? []
        : [<div>{"\u00A0"}</div>, <div>{"\u00A0"}</div>];
      let c = 0;
      for (let row of caption) {
        rows[c] = (
          <div className={"underTitle"} key={"key" + c++}>
            {row}
          </div>
        );
      }
      return (
        // <li className="image-element-class">
        <div className="card">
          {this.Store.isAdminMode ? (
            <Scroll.Link
              to={"topcontenitore"}
              smooth={true}
              duration={250}
              containerId="contenitore"
            >
              <div
                className={"editButton command"}
                onClick={() => this.props.editPicture(element.id)}
              >
                <i className="fa-solid fa-pen-to-square" />
              </div>
            </Scroll.Link>
          ) : null}

          <div
            className={"picture"}
            onClick={() =>
              isMobileOnly ? undefined : this.showGallery(element.index)
            }
          >
            <img src={`/images/small/${element.src}`} alt={caption[0]} />
          </div>
          <div className={"caption"}>
            <b>{title || (isMobileOnly ? undefined : "\u00A0")}</b>
            <div className={"specsBlock"}>
              <div className={"specs"}>{rows}</div>
            </div>
          </div>
        </div>
        // </li>
      );
    });

    if (elements.length) {
      return <div>{childElements}</div>;
    } else {
      return (
        <div className={"mt120"}>
          <h1>Whoops, this sections looks empty</h1>
        </div>
      );
    }
  }
}

export default Gallery;
