import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';

class HomeFooter extends Component {
  render() {

    return (
      <div className="home-footer">
        <p>&copy; 2022 NHD</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
