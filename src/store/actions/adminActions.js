import actionTypes from './actionTypes';
import { getAllCodeService, 
    createNewUserService, 
    getAllUsers, 
    deleteUserService, 
    editUserService,
    getPopularDoctorHomeService,
    getAllDoctorsService,
    saveInfoDoctorsService,
    getAllSpecialty,
    getAllClinic
} from "../../services/userService";
import { toast } from 'react-toastify';


export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('gender');
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (e) {
            dispatch(fetchGenderFailed());
            console.log(e);
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const fetchPositionsStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('position');
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (e) {
            dispatch(fetchPositionFailed());
            console.log(e);
        }
    }
}

export const fetchRolesStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('role');
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (e) {
            dispatch(fetchRoleFailed());
            console.log(e);
        }
    }
}

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Create new user successfully !");
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Cannot create user, check for any invalid information or any information is existed or not !");
                dispatch(saveUserFailed());
            }
        } catch (e) {
            dispatch(saveUserFailed());
            console.log(e);
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED,
})

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers('ALL');
            let resDoctor = await getPopularDoctorHomeService('');
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse()));
            } else {
                dispatch(fetchAllUsersFailed());
            }
        } catch (e) {
            dispatch(fetchAllUsersFailed());
            console.log(e);
        }
    }
}

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
})

export const deleteUserStart = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete user successfully !");
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Cannot delete user !");
                dispatch(deleteUserFailed());
            }
        } catch (e) {
            dispatch(deleteUserFailed());
            console.log(e);
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED,
})

export const editUserStart = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Update successfully !");
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Cannot update user !");
                dispatch(editUserFailed());
            }
        } catch (e) {
            dispatch(editUserFailed());
            console.log(e);
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED,
})

export const fetchPopularDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getPopularDoctorHomeService('');
            if(res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_POPULAR_DOCTOR_SUCCESS,
                    dataDoctors: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_POPULAR_DOCTOR_FAILED
                })
            }
        } catch (e) {
            
        }
    }
}

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctorsService();
            if (res && res.errCode === 0) {
                dispatch(fetchAllDoctorsSuccess(res));
            } else {
                dispatch(fetchAllDoctorsFailed());
            }
        } catch (e) {
            dispatch(fetchAllDoctorsFailed());
            console.log(e);
        }
    }
}

export const fetchAllDoctorsSuccess = (res) => ({
    type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
    dataDoctors: res.data
})

export const fetchAllDoctorsFailed = () => ({
    type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
})

export const saveInfoDoctors = (inputData) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveInfoDoctorsService(inputData);
            if(res && res.errCode === 0) {
                toast.success("Save successfully !")
                dispatch({
                    type: actionTypes.SAVE_INFO_DOCTOR_SUCCESS
                })
            } else {
                toast.error("Cannot save doctor detail !")
                dispatch({
                    type: actionTypes.SAVE_INFO_DOCTOR_FAILED
                })
            }
        } catch (e) {
            
        }
    }
}

export const fetchTimeSchedule = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('TIME');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
            });
            console.log(e);
        }
    }
}

export const getRequiredDoctorInfo = () => {
    return async (dispatch, getState) => {
        try {
            let resPrice = await getAllCodeService('PRICE');
            let resPayment = await getAllCodeService('PAYMENT');
            let resProvince = await getAllCodeService('PROVINCE');
            let resSpecialty = await getAllSpecialty();
            let resClinic = await getAllClinic();

            if (resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0
                && resClinic && resClinic.errCode === 0
                && resSpecialty && resSpecialty.errCode === 0
            ) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resClinic: resClinic.data,
                    resSpecialty: resSpecialty.data,
                }
                dispatch(getRequiredDoctorInfoSuccess(data));
            } else {
                dispatch(getRequiredDoctorInfoFailed());
            }
        } catch (e) {
            dispatch(getRequiredDoctorInfoFailed());
            console.log(e);
        }
    }
}

export const getRequiredDoctorInfoSuccess = (data) => ({
    type: actionTypes.GET_REQUIRED_DOCTOR_INFO_SUCCESS,
    data: data
})

export const getRequiredDoctorInfoFailed = () => ({
    type: actionTypes.GET_REQUIRED_DOCTOR_INFO_FAILED,
})