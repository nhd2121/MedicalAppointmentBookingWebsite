import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./ManageDoctor.scss";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import { getDetailInfoDoctorService } from "../../../services/userService";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Save to markdown table
        contentMarkdown: '',
        contentHTML: '',
        selectedDoctor: '',
        description: '',
        listAllDoctors: [],
        hasOldData: false,

        //Save to doctor_info table
        listPrice: [],
        listPayment: [],
        listProvince: [],
        listClinic: [],
        listSpecialty: [],
        selectedPrice: '',
        selectedPayment: '',
        selectedProvince: '',
        selectedClinic: '',
        selectedSpecialty: '',
        clinicName: '',
        clinicAddress: '',
        note: '',
        clinicId: '',
        specialtyId: ''
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.getRequiredDoctorInfo();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.allDoctors !== this.props.allDoctors) {
        let dataSelected = this.buildDataInput(this.props.allDoctors, "USERS");
        this.setState({
            listAllDoctors: dataSelected
        })
    }

    if(prevProps.language !== this.props.language) {
      let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfo
      let dataSelected = this.buildDataInput(this.props.allDoctors, "USERS");
      let dataSelectedPrice = this.buildDataInput(resPrice, "PRICE");
      let dataSelectedPayment = this.buildDataInput(resPayment, "PAYMENT");
      let dataSelectedProvince = this.buildDataInput(resProvince, "PROVINCE");
      let dataSelectedSpecialty = this.buildDataInput(resSpecialty, "SPECIALTY");
      let dataSelectedClinic = this.buildDataInput(resClinic, "CLINIC");

      this.setState({
          listAllDoctors: dataSelected,
          listPrice: dataSelectedPrice,
          listPayment: dataSelectedPayment,
          listProvince: dataSelectedProvince,
          listSpecialty: dataSelectedSpecialty,
          listClinic: dataSelectedClinic
      })
    }

    if(prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
      let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfo

      let dataSelectedPrice = this.buildDataInput(resPrice, "PRICE");
      let dataSelectedPayment = this.buildDataInput(resPayment, "PAYMENT");
      let dataSelectedProvince = this.buildDataInput(resProvince, "PROVINCE");
      let dataSelectedSpecialty = this.buildDataInput(resSpecialty, "SPECIALTY");
      let dataSelectedClinic = this.buildDataInput(resClinic, "CLINIC");

      this.setState({
        listPrice: dataSelectedPrice,
        listPayment: dataSelectedPayment,
        listProvince: dataSelectedProvince,
        listSpecialty: dataSelectedSpecialty,
        listClinic: dataSelectedClinic
      })
    }
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
        contentMarkdown: text,
        contentHTML: html,
    });
  }

  handleSaveContentMarkdown = () => {
    let { hasOldData } = this.state;
    this.props.saveInfoDoctors({
        contentHTML: this.state.contentHTML,
        contentMarkdown: this.state.contentMarkdown,
        description: this.state.description,
        doctorId: this.state.selectedDoctor.value,
        action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

        selectedPrice: this.state.selectedPrice.value,
        selectedPayment: this.state.selectedPayment.value,
        selectedProvince: this.state.selectedProvince.value,
        clinicName: this.state.clinicName,
        clinicAddress: this.state.clinicAddress,
        note: this.state.note,
        specialtyId: this.state.selectedSpecialty.value,
        clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
    })
  }

  handleChangeSelect = async (selectedDoctor) => {
    this.setState({ 
        selectedDoctor: selectedDoctor
    });
    let { listPrice, listPayment, listProvince, listSpecialty, listClinic } = this.state;

    let res = await getDetailInfoDoctorService(selectedDoctor.value);
    console.log("check res: ", res)
    if(res && res.errCode === 0 && res.data.Markdown) {
        let markdown = res.data.Markdown;
        let clinicAddress = "", clinicName = "", note = "",
            priceId = "", paymentId = "", provinceId = "",
            selectedPrice = "", selectedPayment = "", selectedProvince = "",
            selectedSpecialty = "", specialtyId = "",
            selectedClinic = "", clinicId = ""

        if(res.data.Doctor_Info) {
          
          clinicAddress = res.data.Doctor_Info.addressClinic;
          clinicName = res.data.Doctor_Info.nameClinic;
          note = res.data.Doctor_Info.note;

          priceId = res.data.Doctor_Info.priceId;
          paymentId = res.data.Doctor_Info.paymentId;
          provinceId = res.data.Doctor_Info.provinceId;
          specialtyId = res.data.Doctor_Info.specialtyId;
          clinicId = res.data.Doctor_Info.clinicId;

          selectedPrice = listPrice.find(item => {
            return item && item.value === priceId;
          })
          selectedPayment = listPayment.find(item => {
            return item && item.value === paymentId;
          })
          selectedProvince = listProvince.find(item => {
            return item && item.value === provinceId;
          })
          selectedSpecialty = listSpecialty.find(item => {
            return item && item.value === specialtyId;
          })
          selectedClinic = listClinic.find(item => {
            return item && item.value === clinicId;
          })
        } 

        this.setState({
            contentHTML: markdown.contentHTML,
            contentMarkdown: markdown.contentMarkdown,
            description: markdown.description,
            hasOldData: true,
            clinicAddress: clinicAddress,
            clinicName: clinicName,
            note: note,
            selectedPrice: selectedPrice,
            selectedPayment: selectedPayment,
            selectedProvince: selectedProvince,
            selectedSpecialty: selectedSpecialty,
            selectedClinic: selectedClinic
        })
    } else {
        this.setState({
            contentHTML: '',
            contentMarkdown: '',
            description: '',
            hasOldData: false,
            clinicAddress: '',
            clinicName: '',
            note: '',
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedSpecialty: '',
            selectedClinic: ''
        })
    }
  };

  handleOnChangeDoctorInfo = async (selectedOption, name) => {
    let stateName = name.name;
    let copyState = {...this.state};
    copyState[stateName] = selectedOption;
    this.setState({
      ...copyState
    })
  }

  handleOnChangeText = (event, id) => {
    let stateCopy = {...this.state};
    stateCopy[id] = event.target.value;
    this.setState({
        ...stateCopy
    })
  }

  buildDataInput = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      if(type === "USERS") {
        inputData.map((item, index) => {
            let object = {};
            let labelVi = `${item.lastName} ${item.firstName}`;
            let labelEn = `${item.firstName} ${item.lastName}`; 
            object.label = language === LANGUAGES.VI ? labelVi : labelEn;
            object.value = item.id;
            result.push(object)
        })
      }
      if(type === "PRICE"){
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi} VND`;
          let labelEn = `${item.valueEn} USD`; 
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object)
        })
      }
      if(type === "PAYMENT" || type === "PROVINCE") {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn}`; 
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object)
        })
      }
      if(type === "SPECIALTY") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        })
      }
      if(type === "CLINIC") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        })
      }
    }
    return result
  }

  render() {
    console.log("check props: ", this.props);
    console.log("check state: ", this.state);
    const { selectedDoctor, 
            listAllDoctors, 
            hasOldData, 
            listPrice, 
            listPayment, 
            listProvince,
            listSpecialty,
            listClinic,
            selectedPrice,
            selectedPayment,
            selectedProvince,
            selectedSpecialty,
            selectedClinic
          } = this.state;
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <FormattedMessage id="admin.manage-doctor.title"/> 
        </div>

        <div className="more-info">
            <div className="content-left form-group">
                <label>
                  <FormattedMessage id="admin.manage-doctor.select-doctor"/> 
                </label>
                <Select
                    value={selectedDoctor}
                    onChange={this.handleChangeSelect}
                    options={listAllDoctors}
                />
            </div>
            <div className="content-right">
                <label>
                  <FormattedMessage id="admin.manage-doctor.doctor-info"/> 
                </label>
                <textarea 
                    onChange={(event) => this.handleOnChangeText(event, "description")}
                    value={this.state.description}
                    className="form-control"
                >

                </textarea>
            </div>
        </div>
        <div className="extra-info row">
          <div className="col-4 form-group">
            <label><FormattedMessage id="admin.manage-doctor.price"/></label>
            <Select
              value={selectedPrice}
              onChange={this.handleOnChangeDoctorInfo}
              options={listPrice}
              name="selectedPrice"
            />
          </div>
          <div className="col-4 form-group">
            <label><FormattedMessage id="admin.manage-doctor.payment"/></label>
            <Select
              value={selectedPayment}
              onChange={this.handleOnChangeDoctorInfo}
              options={listPayment}
              name="selectedPayment"
            />
          </div>
          <div className="col-4 form-group">
            <label><FormattedMessage id="admin.manage-doctor.province"/></label>
            <Select
              value={selectedProvince}
              onChange={this.handleOnChangeDoctorInfo}
              options={listProvince}
              name="selectedProvince"
            />
          </div>
          <div className="col-4 form-group">
            <label><FormattedMessage id="admin.manage-doctor.clinicName"/></label>
            <input className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "clinicName")}
              value={this.state.clinicName}
            />
          </div>
          <div className="col-4 form-group">
            <label><FormattedMessage id="admin.manage-doctor.clinicAddress"/></label>
            <input className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "clinicAddress")}
              value={this.state.clinicAddress}
            />
          </div>
          <div className="col-4 form-group">
            <label><FormattedMessage id="admin.manage-doctor.note"/></label>
            <input className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "note")}
              value={this.state.note}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-4 form-group">
              <label>Chọn chuyên khoa</label>
              <Select
                  value={selectedSpecialty}
                  onChange={this.handleOnChangeDoctorInfo}
                  options={listSpecialty}
                  name="selectedSpecialty"
              />
          </div>
          <div className="col-4 form-group">
              <label>Chọn phòng khám</label>
              <Select
                value={selectedClinic}
                onChange={this.handleOnChangeDoctorInfo}
                options={listClinic}
                name="selectedClinic"
              />
          </div>
        </div>

        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
        </div>

        <button 
            onClick={() => this.handleSaveContentMarkdown()}
            className={hasOldData === true ? "save-content-doctor" : "create-content-doctor"}
        >
            {hasOldData === true ? 
              <span><FormattedMessage id="admin.manage-doctor.save-btn"/></span>
              : 
              <span><FormattedMessage id="admin.manage-doctor.add-new-btn"/></span>
            }
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    saveInfoDoctors: (data) => dispatch(actions.saveInfoDoctors(data)),
    getRequiredDoctorInfo: () => dispatch(actions.getRequiredDoctorInfo()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
