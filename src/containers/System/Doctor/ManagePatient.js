import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import { toast } from 'react-toastify';
import DatePicker from "../../../components/Input/DatePicker";
import './ManagePatient.scss';
import { getAllPatientForDoctor, postSendBill } from "../../../services/userService";
import moment from 'moment';
import BillModal from './BillModal';

class DefaultClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenBillModal: false,
            dataModal: {}
        }
    }

    async componentDidMount() {
        
        this.getDataPatient();

    }

    getDataPatient =  async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();

        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatedDate
        })

        if(res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data,
            })
        }
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language) {
            
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
        }, async () => {
            await this.getDataPatient();
        })
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenBillModal: true,
            dataModal: data
        })
    }

    closeBillModal = () => {
        this.setState({
            isOpenBillModal: false,
            dataModal: {}
        })
    }

    sendBill = async (dataFromBillModal) => {
        let { dataModal } = this.state;
        let res = await postSendBill({
            email: dataFromBillModal.email,
            imgBase64: dataFromBillModal.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        })
        console.log("check res: ", res);
        if(res && res.errCode === 0) {
            toast.success('Send bill successfully !');
            this.closeBillModal();
            await this.getDataPatient();
        } else {
            toast.error("Send failed");
        }
    }

    render() {
        let { dataPatient, isOpenBillModal, dataModal } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            Managing Patient
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Select date</label>
                                <DatePicker 
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table style={{width: '100%'}}>
                                    <tr>
                                        <th>STT</th>
                                        <th>Time</th>
                                        <th>Full name</th>
                                        <th>Gender</th>
                                        <th>Actions</th>
                                    </tr>
                                    {dataPatient && dataPatient.length > 0
                                        && dataPatient.map((item, index) => {
                                            let time = language === LANGUAGES.VI ? 
                                            item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;
                                            let gender = language === LANGUAGES.VI ?
                                            item.patientData.genderData.valueVi : item.patientData.genderData.valueEn
                                            return (
                                                <tr key={index}>
                                                    <td>{index+1}</td>
                                                    <td>{time}</td>
                                                    <td>{item.patientData.firstName}</td>
                                                    <td>{item.patientData.address}</td>
                                                    <td>{gender}</td>
                                                    <td>
                                                        <button 
                                                            className='mp-btn-confirm'
                                                            onClick={() => this.handleBtnConfirm(item)}
                                                        >
                                                            Confirm
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </table>
                            </div>
                        </div>
                </div>
                <BillModal 
                    isOpenModal={isOpenBillModal}
                    dataModal={dataModal}
                    closeBillModal={this.closeBillModal}
                    sendBill={this.sendBill}
                />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
