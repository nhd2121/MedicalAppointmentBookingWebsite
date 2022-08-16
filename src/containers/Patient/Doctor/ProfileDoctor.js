import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from "react-intl";
import './ProfileDoctor.scss';
import { getProfileDoctorById } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getDetailInfoDoctorService } from "../../../services/userService";

class DefaultClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {},
            viewProvince: {}
        }
    }

    async componentDidMount() {
        let data = await this.getInfoDoctor(this.props.doctorId);
        this.setState({
            dataProfile: data
        })

        let dataProvince = await this.showProvinceDoctor(this.props.doctorId);
        this.setState({
            viewProvince: dataProvince
        })
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language) {
            let dataProvince = await this.showProvinceDoctor(this.props.doctorId);
            this.setState({
                viewProvince: dataProvince
            })
        }

        if(prevProps.doctorId !== this.props.doctorId) {
            let data = await this.getInfoDoctor(this.props.doctorId);
            this.setState({
                dataProfile: data
            })

            let dataProvince = await this.showProvinceDoctor(this.props.doctorId);
            this.setState({
                viewProvince: dataProvince
            })
        }
    }

    getInfoDoctor = async (id) => {
        let result = {};
        if(id) {
            let res = await getProfileDoctorById(id)
            if(res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }

    renderTimeBooking = (dataTime) => {
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
            
            return (
                <>
                    <div>{time} - {date} </div>
                    <div>Free Booking</div>
                </>
            )
        }
    }

    showProvinceDoctor = async (doctorId) => {
        let result = {};
        if(doctorId) {
            let res = await getDetailInfoDoctorService(doctorId);
            if(res && res.errCode === 0 && res.data.Doctor_Info) {
                result = res.data.Doctor_Info.provinceTypeData;
            }
        }
        return result;
    }

    render() {
        let { dataProfile, viewProvince } = this.state;
        let { language, dataTime, isShowLinkDetail, isShowPrice, doctorId } = this.props;
        let nameVi = '', nameEn = '';
        if(dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='content-left' 
                        style={
                            {backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})`}
                        }
                    >
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description &&
                                <span>
                                    {dataProfile.Markdown.description}
                                </span>
                            }
                            {this.renderTimeBooking(dataTime)}
                        </div>
                    </div>
                </div>
                {isShowLinkDetail === true && 
                    <div className='show-detail-doctor'>
                        <Link to={`/detail-doctor/${doctorId}`}>More</Link>
                    </div>
                }
                {isShowPrice === true &&
                    <div className='price'>
                        <FormattedMessage id="patient.profile-doctor.price"/>
                        {dataProfile && dataProfile.Doctor_Info && language === LANGUAGES.VI &&
                            <NumberFormat 
                                className="currency"
                                value={dataProfile.Doctor_Info.priceTypeData.valueVi} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                suffix={"VND"} 
                            />
                        }
                        {dataProfile && dataProfile.Doctor_Info && language === LANGUAGES.EN &&
                            <NumberFormat 
                                className="currency"
                                value={dataProfile.Doctor_Info.priceTypeData.valueEn} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                suffix={"USD"} 
                            />
                        }
                    </div>
                }
                <div className='show-province-doctor'>
                    {
                        language === LANGUAGES.VI ? viewProvince.valueVi : viewProvince.valueEn
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
