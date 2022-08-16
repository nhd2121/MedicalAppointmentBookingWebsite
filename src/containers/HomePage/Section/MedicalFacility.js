import React, { Component } from "react";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import { FormattedMessage } from "react-intl";
import { getAllClinic } from "../../../services/userService";
import Slider from "react-slick";
import { withRouter } from "react-router";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class MedicalFacility extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clinicData: [],
    }
  }

  async componentDidMount () {
    let res = await getAllClinic();
    
    if (res && res.errCode === 0) {
      this.setState({
        clinicData: res.data ? res.data : []
      })
    }
  }

  handleViewDetailClinic = (clinic) => {
    if(this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
  }

  render() {
    let { clinicData } = this.state;
    return (
      <div className="Section-share Medical-facility-section">
        <div className="Section-container">
          <div className="Section-header">
            <span className="Section-header-title">Cơ sở y tế nổi bật</span>
            <button className="Section-header-btn">Xem thêm</button>
          </div>
          <div className="Section-body">
          <Slider {...this.props.settings}>
              {clinicData && clinicData.length > 0 
                && clinicData.map((item, index) => {
                  return (
                    <div className="Section-customize" key={index}>
                      <div 
                          className="bg-image bg-img-specialty"
                          style={{backgroundImage: `url(${item.image})`}}
                          onClick={() => this.handleViewDetailClinic(item)}
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
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
