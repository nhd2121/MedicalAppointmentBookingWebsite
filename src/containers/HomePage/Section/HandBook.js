import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";

class HandBook extends Component {
  render() {

    return (
      <div className="Section-share HandBook-section">
        <div className="Section-container">
          <div className="Section-header">
            <span className="Section-header-title">Cẩm nang</span>
            <button className="Section-header-btn">Tất cả bài viết</button>
          </div>
          <div className="Section-body">
            <Slider {...this.props.settings}>
              <div className="Section-customize">
                <div className="bg-image bg-img-handbook"></div>
                <div>Cơ xương khớp</div>
              </div>
              <div className="Section-customize">
                <div className="bg-image bg-img-handbook"></div>
                <div>test 2</div>
              </div>
              <div className="Section-customize">
                <div className="bg-image bg-img-handbook"></div>
                <div>test 3</div>
              </div>
              <div className="Section-customize">
                <div className="bg-image bg-img-handbook"></div>
                <div>test 4</div>
              </div>
              <div className="Section-customize">
                <div className="bg-image bg-img-handbook"></div>
                <div>test 5</div>
              </div>
              <div className="Section-customize">
                <div className="bg-image bg-img-handbook"></div>
                <div>test 6</div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
