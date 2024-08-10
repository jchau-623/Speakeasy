// Action Types
const LOAD_HISTORY = 'history/LOAD_HISTORY';
const ADD_HISTORY_ITEM = 'history/ADD_HISTORY_ITEM';
const EDIT_HISTORY_ITEM = 'history/EDIT_HISTORY_ITEM';
const DELETE_HISTORY_ITEM = 'history/DELETE_HISTORY_ITEM';

// Action Creators
export const loadHistory = (history) => ({
    type: LOAD_HISTORY,
    history: history.map(item => ({
        ...item,
        id: item._id  // Normalize _id to id
    })),
});

const addHistoryItem = (item) => ({
    type: ADD_HISTORY_ITEM,
    item: { ...item, id: item._id }, // Normalize _id to id
});

const editHistoryItem = (item) => ({
    type: EDIT_HISTORY_ITEM,
    item: { ...item, id: item._id }, // Normalize _id to id
});

const deleteHistoryItem = (id) => ({
    type: DELETE_HISTORY_ITEM,
    id, // Use id directly
});

// Thunks for Async Actions
export const getUserHistory = (userId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/history/?user_id=${userId}`);
        if (response.ok) {
            const data = await response.json();
            console.log('Fetched history data:', data.history); // Log to verify data structure
            dispatch(loadHistory(data.history));
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred while fetching history');
        }
    } catch (error) {
        console.error('Error fetching history:', error);
    }
};

export const createHistoryItem = (itemData) => async (dispatch) => {
    try {
        const response = await fetch('/api/history/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(addHistoryItem(data));
            return data;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred while creating the history item');
        }
    } catch (error) {
        console.error('Error creating history item:', error);
        throw error;
    }
};

export const updateHistoryItem = (term, itemData) => async (dispatch) => {
    try {
        const response = await fetch(`/api/history?term=${encodeURIComponent(term)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(editHistoryItem(data));
            return data;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update history item');
        }
    } catch (error) {
        console.error('Error updating history item:', error);
        throw error;
    }
};

export const removeHistoryItem = (term) => async (dispatch) => {
    try {
        console.log(`Deleting history item with term: ${term}`);

        const response = await fetch(`/api/history?term=${encodeURIComponent(term)}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            dispatch(deleteHistoryItem(term));
            console.log('History item successfully deleted');
        } else {
            const errorData = await response.json();
            console.error('Failed to delete history item:', errorData);
            throw new Error(errorData.message || 'Failed to delete history item');
        }
    } catch (error) {
        console.error('Error deleting history item:', error);
        throw error;
    }
};


// Initial State
const initialState = [];

// Reducer
export default function historyReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_HISTORY:
            return action.history;
        case ADD_HISTORY_ITEM:
            return [...state, action.item];
        case EDIT_HISTORY_ITEM:
            return state.map(item =>
                item.term === action.item.term ? action.item : item
            );
        case DELETE_HISTORY_ITEM:
            return state.filter(item => item.term !== action.term);
        default:
            return state;
    }
}