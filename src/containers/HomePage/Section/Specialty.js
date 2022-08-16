import React, { Component } from "react";
import { connect } from "react-redux";
import "./Specialty.scss";
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import { getAllSpecialty } from "../../../services/userService";
import { withRouter } from "react-router";


class Specialty extends Component {
  constructor(props) {
    super(props)
    this.state = {
      specialtyData: [],
    }
  }
  async componentDidMount () {
    let res = await getAllSpecialty();
    console.log("check res: ", res);
    if (res && res.errCode === 0) {
      this.setState({
        specialtyData: res.data ? res.data : []
      })
    }
  }

  handleViewDetailSpecialty = (item) => {
    if(this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  }

  render() {
    let { specialtyData } = this.state;
    return (
      <div className="Section-share Specialty-section">
        <div className="Section-container">
          <div className="Section-header">
            <span className="Section-header-title">Chuyên khoa phổ biến</span>
            <button className="Section-header-btn">Xem thêm</button>
          </div>
          <div className="Section-body">
            <Slider {...this.props.settings}>
              {specialtyData && specialtyData.length > 0 
                && specialtyData.map((item, index) => {
                  return (
                    <div className="Section-customize" key={index}>
                      <div 
                          className="bg-image bg-img-specialty"
                          style={{backgroundImage: `url(${item.image})`}}
                          onClick={() => this.handleViewDetailSpecialty(item)}
                      >

                      </div>
                      <div className="specialty-name">{item.name}</div>
                    </div>
                  )
                })
              }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
