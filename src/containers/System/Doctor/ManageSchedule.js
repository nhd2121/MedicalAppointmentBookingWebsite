import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from "react-intl";
import * as actions from "../../../store/actions";
import Select from 'react-select';
import { LANGUAGES, formatedDate } from '../../../utils';
import DatePicker from "../../../components/Input/DatePicker";
import moment from 'moment';
import { toast } from 'react-toastify';
import _, { result } from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedDoctor: {},
            listAllDoctors: [],
            currentDate: '',
            rangeTime: []
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchTimeSchedule();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelected = this.buildDataInput(this.props.allDoctors);
            this.setState({
                listAllDoctors: dataSelected
            })
        }

        if(prevProps.allTimeSchedule !== this.props.allTimeSchedule) {
            let data = this.props.allTimeSchedule;
            data.map((item) => {
                item.isSelected = false;
                return item
            })
            this.setState({
                rangeTime: data
            })
        }
    
        if(prevProps.language !== this.props.language) {
            let dataSelected = this.buildDataInput(this.props.allDoctors);
            this.setState({
                listAllDoctors: dataSelected
            })
        }
    }

    buildDataInput = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`; 
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object)
            })
        }
        return result
    }

    handleChange = async (selectedDoctor) => {
        this.setState({ 
            selectedDoctor: selectedDoctor
        });
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
        })
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if ( rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map((item) => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item
            })
        }
        this.setState({
            rangeTime: rangeTime
        })
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];

        if(!currentDate) {
            toast.error("Please select time !");
            return;
        }
        if(selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Please choose Doctor");
            return;
        }

        let dateFormat = new Date(currentDate).getTime();

        if(rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if(selectedTime && selectedTime.length > 0) {
                selectedTime.map(schedule => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = dateFormat;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                })
            } else {
                toast.error("Please select time schedule !");
                return; 
            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            Formateddate: dateFormat
        });
        
        if(res && res.errCode === 0) {
            toast.success("Save successfully");
        } else {
            toast.error("Cannot save");
        }

    }

    render() {
        let { selectedDoctor } = this.state;
        let { listAllDoctors } = this.state;
        let { rangeTime } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return (
            <React.Fragment>
                <div className="manage-schedule-container">
                    <div className='m-s-title'>
                        <FormattedMessage id='manage-schedule.title'/>
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id='manage-schedule.select-doctor'/></label>
                                <Select
                                    value={selectedDoctor}
                                    onChange={this.handleChange}
                                    options={listAllDoctors}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id='manage-schedule.select-time-schedule'/></label>
                                <DatePicker 
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.currentDate}
                                    minDate={yesterday}
                                />
                            </div>
                            <div className='col-12 select-hour-container'>
                                {rangeTime && rangeTime.length > 0 &&
                                    rangeTime.map((item, index) => {
                                        return (
                                            <button
                                                key={index}
                                                className={item.isSelected === true ? 
                                                    "btn btn-schedule active" : "btn btn-schedule"
                                                }
                                                onClick={() => this.handleClickBtnTime(item)}
                                            >
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                            <div className='col-12'>
                                <button className='btn btn-primary btn-save-schedule'
                                    onClick={() => this.handleSaveSchedule()}
                                >
                                    <FormattedMessage id='manage-schedule.save-button'/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allTimeSchedule: state.admin.allTimeSchedule
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchTimeSchedule: () => dispatch(actions.fetchTimeSchedule()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
