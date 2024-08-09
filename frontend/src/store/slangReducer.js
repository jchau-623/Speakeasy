//type string
const GET_ALL_SLANGS = "GET_ALL_SLANGS";
const GET_ONE_SLANG = "GET_ONE_SLANG";
const CREATE_SLANG = "CREATE_SLANG";
const SEARCH_SLANG ="SEARCH_SLANG;"

const LOADING = "LOADING"


//actions
const getAllSlangsAction = (slangs) => {
    return {
        type: GET_ALL_SLANGS,
        payload: slangs
    }
}



const getOneSlangAction = (slang) => {
    return {
        type: GET_ONE_SLANG,
        payload: slang
    }
}   

const createSlangAction = (slang) => {
    return {
        type: CREATE_SLANG,
        payload:slang
    }
}

export const searchSlangAction = (slang) => {
    return {
        type: SEARCH_SLANG,
        payload:slang
    }
}


export const loadingAction = (loading)=>{
    return {
        type:LOADING,
        payload:loading
    }
}



 //fetches



export const getAllSlangs = () => async (dispatch) => {
    try {
        const response = await fetch('/api/slangs', {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
           
        });

        if (response.ok) {
            const slangs = await response.json();
            dispatch(getAllSlangsAction(slangs));
            return { success: true, slangs };
        } else {
            const error = await response.json();
            return { success: false, error };
        }
    } catch (err) {
        return { success: false, error: { message: 'Failed to fetch slangs' } };
    }
}


export const getOneSlang = (id) => async (dispatch) => {
    try {
        const response = await fetch(`/api/slangs/${id}`, {
            method: 'GET'
           
        });
        if (response.ok) {
            const slang = await response.json();
            dispatch(getOneSlangAction(slang));
            return slang;
        } else {
            const error = await response.json();
            console.error("Failed to fetch slang", error);
            return error;
        }
    } catch (err) {
        console.error("Failed to fetch slang", err);
        return { error: "Failed to fetch slang" };
    }
}


export const createSlang = (slang) => async (dispatch) => {
    
    try {
        const response = await fetch('/api/slangs/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(slang)
        });

        if (response.ok) {
            const newSlang = await response.json();
            dispatch(createSlangAction(newSlang));
            return { success: true, newSlang };
        } else {
            const error = await response.json();
            return { success: false, error: error };
        }
    } catch (err) {
        return { success: false, error: { message: 'An error occurred. Please try again.' } };
    }
}

export const search = (data) => async (dispatch) => {
   
    try {
        
        const response = await fetch(`/api/search/?term=${data.term}&user_id=${data.user_id}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
           
        });

        if (response.ok) {
            const slangs = await response.json();
            dispatch(searchSlangAction(slangs));
            return { success: true, slangs };
        } else {
            const error = await response.json();
            return { success: false, error };
        }
    } catch (err) {
        return { success: false, error: { message: 'Failed to fetch slangs' } };
    }
}




//initial states

const initialState =

{ 
    slangs: {},
    slang:null,
    loading:false
  
 };

//reducer


const slangReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_SLANGS:
            newState = {...state}
            newState.slangs = action.payload.reduce((acc, curr)=>{
                acc[curr._id]=curr
                return acc;
            }, {})
            return newState;
        case GET_ONE_SLANG:
            newState = {...state}
            newState.slang = action.payload;
            return newState;
        case CREATE_SLANG:
            newState = {...state}
            newState.slang = action.payload
            newState.slangs[action.payload._id]=action.payload
            return newState;
        case SEARCH_SLANG:
            newState = {...state}
        
            newState.slang=action.payload
            return newState;
        case LOADING:
            newState = {...state}
            
            newState.loading=action.payload
            return newState;
       
        default:
            return state;
    }
}   

export default slangReducer;



