import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { withRouter } from "react-router";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class PopularDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }

  componentDidMount() {
    this.props.loadPopularDoctor();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.popularDoctorRedux !== this.props.popularDoctorRedux) {
      this.setState({
        arrDoctors: this.props.popularDoctorRedux,
      });
    }
  }


  handleViewDetailDoctor = (doctor) => {
    if(this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  }

  render() {
    let { arrDoctors } = this.state;
    let { language } = this.props;
    return (
      <div className="Section-share Popular-doctor-section">
        <div className="Section-container">
          <div className="Section-header">
            <span className="Section-header-title"><FormattedMessage id='homepage.out-standing-doctor'/></span>
            <button className="Section-header-btn"><FormattedMessage id='homepage.more-info'/></button>
          </div>
          <div className="Section-body">
            <Slider {...this.props.settings}>
              {arrDoctors &&
                arrDoctors.length > 0 &&
                arrDoctors.map((item, index) => {
                  let imageBase64 = '';
                  if (item.image) {
                    imageBase64 = new Buffer(item.image, "base64").toString("binary");
                  }
                  let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                  let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

                  return (
                    <div 
                      className="Section-customize" 
                      key={index}
                      onClick={() => this.handleViewDetailDoctor(item)}
                    >
                      <div className="wrapper-img">
                        <div
                          className="bg-image bg-img-popular-doctor"
                          style={{ backgroundImage: `url(${imageBase64})` }}
                        ></div>
                      </div>
                      <div className="position text-center">
                        <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    popularDoctorRedux: state.admin.popularDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadPopularDoctor: () => dispatch(actions.fetchPopularDoctor()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PopularDoctor));
