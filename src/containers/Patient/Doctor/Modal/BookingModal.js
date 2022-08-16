import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookAppointment } from "../../../../services/userService";
import {toast} from "react-toastify";
import moment from 'moment';
import NumberFormat from 'react-number-format';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            genders: '',
            doctorId: '',
            birthday: '',
            selectedGender: ''
        }
    }

    async componentDidMount() {
        this.props.getGenders();
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language) {
            let { genders } = this.props;
            this.setState({
                genders: this.buildDataGender(genders)
            })
        }

        if(prevProps.genders !== this.props.genders) {
            let { genders } = this.props;
            this.setState({
                genders: this.buildDataGender(genders)
            })
        }

        if(prevProps.dataTime !== this.props.dataTime) {
            if(this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId
                let timeType = this.props.dataTime.timeType
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }

    buildDataGender = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item) => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
        }
        return result;
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let copyState = {...this.state};
        copyState[id] = valueInput;
        this.setState({
            ...copyState
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleOnChangeGender = (selectedOptions) => {
        this.setState({
            selectedGender: selectedOptions
        })
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        
        if(dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? 
                dataTime.timeTypeData.valueVi 
                : 
                dataTime.timeTypeData.valueEn;

            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            
            return `${time} - ${date}`
        }
        return ''
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        
        if(dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            
            return name;
        }
        return ''
    }

    handleConfirmBooking = async () => {
        let { dataTime } = this.props;
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(dataTime);
        let doctorName = this.buildDoctorName(dataTime);

        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            doctorId: this.state.doctorId,
            date: this.props.dataTime.date,
            birthday: date,
            selectedGender: this.state.selectedGender.value,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })

        if(res && res.errCode === 0) {
            toast.success("Book successfully");
            this.props.closeBookingClose();
        } else {
            toast.error("Cannot book")
        }
    }

    render() {
        let { isOpenModal, closeBookingClose, dataTime } = this.props;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : "";
        return (
            <Modal 
                isOpen={isOpenModal} 
                className={'booking-modal-container'}
                size='lg'
                centered
            >
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>
                            <FormattedMessage id="patient.booking-modal.title"/>
                        </span>
                        <span 
                            className='right'
                            onClick={closeBookingClose}
                        >
                            <i className='fas fa-times'></i>
                        </span>
                    </div>
                    <div className='booking-modal-body'>
                        <div className='doctor-info'>
                            <ProfileDoctor 
                                doctorId={doctorId}
                                dataTime={dataTime}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                                // isShowProvince={false}
                            />
                        </div>
                        
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.fullName"/>
                                </label>
                                <input className='form-control'
                                    value={this.state.fullName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.phoneNumber"/>
                                </label>
                                <input className='form-control'
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.email"/>
                                </label>
                                <input className='form-control'
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.address"/>
                                </label>
                                <input className='form-control'
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.reason"/>
                                </label>
                                <input className='form-control'
                                    value={this.state.reason}
                                    onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.birthday"/>
                                </label>
                                <DatePicker 
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.birthday}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.genders"/>
                                </label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleOnChangeGender}
                                    options={this.state.genders}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button 
                            className='btn-booking-confirm'
                            onClick={() => this.handleConfirmBooking()}
                        >
                            <FormattedMessage id="patient.booking-modal.save-btn"/>
                        </button>
                        <button 
                            className='btn-booking-cancel'
                            onClick={closeBookingClose}
                        >
                            <FormattedMessage id="patient.booking-modal.cancel-btn"/>
                        </button>
                    </div>
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
