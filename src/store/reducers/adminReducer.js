import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    positions: [],
    users: [],
    popularDoctors: [],
    allDoctors: [],
    allTimeSchedule: [],
    allRequiredDoctorInfo: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        // case actionTypes.FETCH_GENDER_START:
        //     return {
        //         ...state,
        //     }
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_GENDER_FAILED:
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_FAILED:
            state.positions = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.users;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_POPULAR_DOCTOR_SUCCESS:
            state.popularDoctors = action.dataDoctors;
            return {
                ...state,
            }
        case actionTypes.FETCH_POPULAR_DOCTOR_FAILED:
            state.popularDoctors = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
            state.allDoctors = action.dataDoctors;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_DOCTOR_FAILED:
            state.allDoctors = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            state.allTimeSchedule = action.dataTime;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
            state.allTimeSchedule = [];
            return {
                ...state,
            }
        case actionTypes.GET_REQUIRED_DOCTOR_INFO_SUCCESS:
            state.allRequiredDoctorInfo = action.data;
            return {
                ...state,
            }
        case actionTypes.GET_REQUIRED_DOCTOR_INFO_FAILED:
            state.allRequiredDoctorInfo = [];
            return {
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;