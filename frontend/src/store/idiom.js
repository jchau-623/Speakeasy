const LOAD_IDIOMS = 'idioms/LOAD_IDIOMS';
const ADD_IDIOM = 'idioms/ADD_IDIOM';
const EDIT_IDIOM = 'idioms/EDIT_IDIOM';
const DELETE_IDIOM = 'idioms/DELETE_IDIOM';

const loadIdioms = (idioms) => ({
    type: LOAD_IDIOMS,
    idioms,
});

const addIdiom = (idiom) => ({
    type: ADD_IDIOM,
    idiom,
});

const editIdiom = (idiom) => ({
    type: EDIT_IDIOM,
    idiom,
});

const deleteIdiom = (idiomId) => ({
    type: DELETE_IDIOM,
    idiomId,
});

export const getIdioms = () => async (dispatch) => {
    const response = await fetch('/api/idioms/');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadIdioms(data));
    }
};

export const createIdiom = (idiomData) => async (dispatch) => {
    const response = await fetch('/api/idioms/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(idiomData),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(addIdiom(data));
        return data;
    } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred');
    }
};

export const updateIdiom = (idiomData) => async (dispatch) => {
    const response = await fetch(`/api/idioms/${idiomData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(idiomData),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(editIdiom(data));
        return data;
    } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update idiom');
    }
};

export const removeIdiom = (idiomId) => async (dispatch) => {
    const response = await fetch(`/api/idioms/${idiomId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteIdiom(idiomId));
    }
};

const initialState = [];

export default function idiomsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_IDIOMS:
            return action.idioms;
        case ADD_IDIOM:
            return [...state, action.idiom];
        case EDIT_IDIOM:
            return state.map(idiom =>
                idiom.id === action.idiom.id ? action.idiom : idiom
            );
        case DELETE_IDIOM:
            return state.filter(idiom => idiom.id !== action.idiomId);
        default:
            return state;
    }
}