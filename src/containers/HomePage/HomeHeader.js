import React, { Component } from "react";
import { connect } from "react-redux";
import './HomeHeader.scss';
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import { withRouter } from "react-router";

import { changeLanguageApp } from "../../store/actions";

class HomeHeader extends Component {

  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
    //fire redux event: actions
  }

  handleReturnToHomePage = () => {
    if(this.props.history) {
      this.props.history.push(`/home`);
    }
  }

  render() {
    let language = this.props.language;
    return(
      <React.Fragment>
        <div className="home-header-container">
            <div className="home-header-content">
                <div className="left-content">
                    <i className="fas fa-bars"></i>
                    <div 
                      className="header-logo"
                      onClick={() => this.handleReturnToHomePage()}
                    >
                    </div>
                </div>
                <div className="center-content">
                    <div className="child-content">
                        <div><b><FormattedMessage id="homeHeader.specialist"/></b></div>
                        <div><FormattedMessage id="homeHeader.searchDoctor"/></div>
                    </div>
                    <div className="child-content">
                        <div><b><FormattedMessage id="homeHeader.health-facility"/></b></div>
                        <div><FormattedMessage id="homeHeader.select-hospital"/></div>
                    </div>
                    <div className="child-content">
                        <div><b><FormattedMessage id="homeHeader.doctor"/></b></div>
                        <div><FormattedMessage id="homeHeader.find-doctor"/></div>
                    </div>
                    <div className="child-content">
                        <div><b><FormattedMessage id="homeHeader.package"/></b></div>
                        <div><FormattedMessage id="homeHeader.medical-checkup"/></div>
                    </div>
                </div>
                <div className="right-content">
                    <div className="support"><i className="fas fa-question-circle"></i><FormattedMessage id="homeHeader.support"/></div>
                    <div className={language === LANGUAGES.VI ? "language-vi active" : "language-vi"}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span></div>
                    <div className={language === LANGUAGES.EN ? "language-en active" : "language-en"}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                </div>
            </div> 
        </div>
        {this.props.isShowedBanner === true &&
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1"><FormattedMessage id="banner.slogan-1"/></div>
              <div className="title2"><FormattedMessage id="banner.slogan-2"/></div>
              <div className="search">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Tìm chuyên khoa khám bệnh"/>
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div className="option-child">
                  <div className="icon-child"><i className="far fa-hospital"></i></div>
                  <div className="text-child"><FormattedMessage id="banner.child-1"/></div>
                </div>
                <div className="option-child">
                  <div className="icon-child"><i className="fas fa-mobile-alt"></i></div>
                  <div className="text-child"><FormattedMessage id="banner.child-2"/></div>
                </div>
                <div className="option-child">
                  <div className="icon-child"><i className="fas fa-procedures"></i></div>
                  <div className="text-child"><FormattedMessage id="banner.child-3"/></div>
                </div>
                <div className="option-child">
                  <div className="icon-child"><i className="fas fa-microscope"></i></div>
                  <div className="text-child"><FormattedMessage id="banner.child-4"/></div>
                </div>
                <div className="option-child">
                  <div className="icon-child"><i className="fas fa-head-side-virus"></i></div>
                  <div className="text-child"><FormattedMessage id="banner.child-5"/></div>
                </div>
                <div className="option-child">
                  <div className="icon-child"><i className="fas fa-tooth"></i></div>
                  <div className="text-child"><FormattedMessage id="banner.child-6"/></div>
                </div>
              </div>
            </div>
          </div>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
