//type string
const USER_SIGNIN = 'USER_SIGN';
const USER_SIGNUP = 'USER_SIGNUP_SUCCESS';
const GET_USER = "GET_USER";
const USER_LOGOUT = 'USER_LOGOUT';
const DELETE_USER =  'DELETE_USER';

//action creator
const userSignin = (user) => {
    return {
        type: USER_SIGNIN,
        payload: user
    }
}

const userSignup = (user) => {
    return {
        type: USER_SIGNUP,
        payload: user
    }
}

const getUser = (user) => {
    return {
        type: GET_USER,
        payload: user
    }
}   

const userLogout = () => {
    return {
        type: USER_LOGOUT
    }
}

const deleteUser = () => {
    return {
        type: DELETE_USER
    }
}


//thunk action creator
export const signinThunk = (user) => async (dispatch) => {
    // console.log("in the signinThunk")
    try {
        const response = await fetch('/api/user/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(user).toString()
        });

        if (response.ok) {
            const user = await response.json();
            dispatch(userSignin(user));
            return { success: true, user };
        } else {
            const error = await response.json();
            return { success: false, error: error };
        }
    } catch (err) {
        return { success: false, error: { message: 'Network error' } };
    }
}

export const signupThunk = (user) => async (dispatch) => {
    try {
        const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            const user = await response.json();
            dispatch(userSignup(user));
            return { success: true, user };
        } else {
            const error = await response.json();
            return { success: false, error };
        }
    } catch (err) {
        return { success: false, error: { message: 'Network error' } };
    }
}


export const getUserThunk = () => async (dispatch) => {
    try {
        const response = await fetch('/api/user/', {
            method: 'GET',
            credentials: 'include' // Ensure cookies are sent with the request
        });
        if (response.ok) {
            const user = await response.json();
            dispatch(getUser(user));
            return user;
        } else {
            const error = await response.json();
            console.error("Error fetching user:", error);
            return error;
        }
    } catch (err) {
        console.error("Network error:", err);
        return { error: "Network error" };
    }
}

export const logoutThunk = () => async (dispatch) => {
    console.log("in the logoutThunk");
    try {
        const response = await fetch('/api/user/logout', {
            method: 'POST',
            credentials: 'include' // This ensures cookies are sent with the request
        });
        if (response.ok) {
            dispatch(userLogout());
            return { success: true };
        } else {
            const error = await response.json();
            console.error("Logout failed:", error);
            return error;
        }
    } catch (err) {
        console.error("Network error:", err);
        return { error: "Network error" };
    }
}

export const deleteUserThunk = () => async (dispatch) => {
    try {
        const response = await fetch('/api/user/', {
            method: 'DELETE'
        });
        if (response.ok) {
            dispatch(deleteUser());
        }
    } catch (err) {
        const error = await error.json();
        return error;
    }
}


//reducer

const initialState = { user: null };
const userReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case USER_SIGNIN:
            newState = Object.assign({}, state);
            newState.user = action.payload;
            return newState;
        case USER_SIGNUP:
            newState = Object.assign({}, state);
            newState.user = action.payload;
            return newState;
        case GET_USER:
            newState = Object.assign({}, state);
            newState.user = action.payload;
            return newState;
        case USER_LOGOUT:
            newState = Object.assign({}, state);
            newState.user = null;
            return newState;
        case DELETE_USER:
            newState = Object.assign({}, state);
            newState.user = null;
            return newState;
        default:
            return state;
    }
}   

export default userReducer;

