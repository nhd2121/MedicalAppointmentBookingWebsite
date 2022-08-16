import { reject } from "lodash";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";
import TableManageUser from "./TableManageUser";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      positionArr: [],
      roleArr: [],
      previewImgUrl: "",
      isOpen: false,

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      avatar: "",

      action: "",
      userEditId: ""
    };
  }

  async componentDidMount() {
    this.props.fetchGenderStart();
    this.props.fetchPositionsStart();
    this.props.fetchRolesStart();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let arrGenders = this.props.genderRedux;
    if (prevProps.genderRedux !== this.props.genderRedux) {
      this.setState({
        genderArr: arrGenders,
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
      });
    }

    if (prevProps.positionRedux !== this.props.positionRedux) {
      let arrPositions = this.props.positionRedux;
      this.setState({
        positionArr: arrPositions,
        position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
      });
    }

    if (prevProps.roleRedux !== this.props.roleRedux) {
      let arrRoles = this.props.roleRedux;
      this.setState({
        roleArr: arrRoles,
        role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
      });
    }

    if (prevProps.listUsers !== this.props.listUsers) {
        let arrGenders = this.props.genderRedux;
        let arrPositions = this.props.positionRedux;
        let arrRoles = this.props.roleRedux;

        this.setState({
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            address: "",
            gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
            position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
            role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
            avatar: "",
            previewImgUrl: "",
            action: CRUD_ACTIONS.CREATE,
        });
      }
  }

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
        let base64 = await CommonUtils.getBase64(file);
        let objectUrl = URL.createObjectURL(file);
        this.setState({
          previewImgUrl: objectUrl,
          avatar: base64,
        });
    }
  };

  openPreviewImage = () => {
    if (!this.state.previewImgUrl) {
      return;
    }
    this.setState({
      isOpen: true,
    });
  };

  handleSaveUser = () => {
    let isValid = this.checkValidInput();
    if (isValid === false) {
      return;
    }
    let { action } = this.state;
    if(action === CRUD_ACTIONS.CREATE) {
        // fire redux create user action
        this.props.createNewUser({
          email: this.state.email,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          address: this.state.address,
          gender: this.state.gender,
          roleId: this.state.role,
          positionId: this.state.position,
          phonenumber: this.state.phoneNumber,
          avatar: this.state.avatar
        });
    }
    if(action === CRUD_ACTIONS.EDIT) {
        // fire redux edit user action
        this.props.editUserRedux({
            id: this.state.userEditId,
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            gender: this.state.gender,
            roleId: this.state.role,
            positionId: this.state.position,
            phonenumber: this.state.phoneNumber,
            avatar: this.state.avatar
        })
    }

  };

  checkValidInput = () => {
    let isValid = true;
    let arrCheck = [
      "email",
      "password",
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
    ];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        alert("This field is required: " + arrCheck[i]);
        break;
      }
    }

    return isValid;
  };

  onChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  handleEditUserFromParent = (user) => {
    let imageBase64 = '';
    if(user.image) {
        imageBase64 = new Buffer(user.image, 'base64').toString('binary');
    }
    this.setState({
        email: user.email,
        password: "password",
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phonenumber,
        address: user.address,
        gender: user.gender,
        position: user.positionId,
        role: user.roleId,
        avatar: "",
        previewImgUrl: imageBase64,
        action: CRUD_ACTIONS.EDIT,
        userEditId: user.id
    })
  }

  render() {
    let genders = this.state.genderArr;
    let positions = this.state.positionArr;
    let roles = this.state.roleArr;
    let language = this.props.language;
    let {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
      avatar,
    } = this.state;
    return (
      <div className="user-redux-container">
        <div className="title">Learn React-Redux</div>
        <div className="user-redux-body">
          <div className="container">
            <div className="row">
              <div className="col-12 my-3">
                <FormattedMessage id="manage-user.add" />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.email" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={email}
                  onChange={(event) => {
                    this.onChangeInput(event, "email");
                  }}
                  disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.password" />
                </label>
                <input
                  className="form-control"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    this.onChangeInput(event, "password");
                  }}
                  disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.firstName" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={firstName}
                  onChange={(event) => {
                    this.onChangeInput(event, "firstName");
                  }}
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.lastName" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={lastName}
                  onChange={(event) => {
                    this.onChangeInput(event, "lastName");
                  }}
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.phoneNumber" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={phoneNumber}
                  onChange={(event) => {
                    this.onChangeInput(event, "phoneNumber");
                  }}
                />
              </div>
              <div className="col-9">
                <label>
                  <FormattedMessage id="manage-user.address" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={address}
                  onChange={(event) => {
                    this.onChangeInput(event, "address");
                  }}
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.gender" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) => {
                    this.onChangeInput(event, "gender");
                  }}
                  value={gender}
                >
                  {genders &&
                    genders.length > 0 &&
                    genders.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.position" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) => {
                    this.onChangeInput(event, "position");
                  }}
                  value={position}
                >
                  {positions &&
                    positions.length > 0 &&
                    positions.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.roleID" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) => {
                    this.onChangeInput(event, "role");
                  }}
                  value={role}
                >
                  {roles &&
                    roles.length > 0 &&
                    roles.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.image" />
                </label>
                <div className="preview-img-container">
                  <input
                    id="previewImg"
                    type="file"
                    hidden
                    onChange={(event) => this.handleOnChangeImage(event)}
                  />
                  <label className="label-upload" htmlFor="previewImg">
                    Tải ảnh
                    <i className="fas fa-upload"></i>
                  </label>
                  <div
                    className="preview-image"
                    style={{
                      backgroundImage: `url(${this.state.previewImgUrl})`,
                    }}
                    onClick={() => this.openPreviewImage()}
                  ></div>
                </div>
              </div>
            </div>
            <div className="col-12 my-3">
              <button
                className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning px-3" : "btn btn-primary px-3"}
                onClick={() => this.handleSaveUser()}
              >
                {this.state.action === CRUD_ACTIONS.EDIT ? 
                    <FormattedMessage id="manage-user.button-save-edit" /> 
                    : 
                    <FormattedMessage id="manage-user.button-save"/>
                }
              </button>
            </div>

            <div className="col-12 mb-5">
                <TableManageUser 
                    handleEditUserFromParent = {this.handleEditUserFromParent}
                    action = {this.state.action}
                />
            </div>
          </div>
        </div>

        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgUrl}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>


    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    positionRedux: state.admin.positions,
    roleRedux: state.admin.roles,
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
    fetchPositionsStart: () => dispatch(actions.fetchPositionsStart()),
    fetchRolesStart: () => dispatch(actions.fetchRolesStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)),
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    editUserRedux: (data) => dispatch(actions.editUserStart(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
