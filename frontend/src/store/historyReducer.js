// Action Types
const LOAD_HISTORY = 'history/LOAD_HISTORY';
const ADD_HISTORY_ITEM = 'history/ADD_HISTORY_ITEM';
const EDIT_HISTORY_ITEM = 'history/EDIT_HISTORY_ITEM';
const DELETE_HISTORY_ITEM = 'history/DELETE_HISTORY_ITEM';

// Action Creators
const loadHistory = (history) => ({
    type: LOAD_HISTORY,
    history,
});

const addHistoryItem = (item) => ({
    type: ADD_HISTORY_ITEM,
    item,
});

const editHistoryItem = (item) => ({
    type: EDIT_HISTORY_ITEM,
    item,
});

const deleteHistoryItem = (itemId) => ({
    type: DELETE_HISTORY_ITEM,
    itemId,
});

// Thunks for Async Actions
export const getUserHistory = (userId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/history/?user_id=${userId}`);
        if (response.ok) {
            const data = await response.json();
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

export const updateHistoryItem = (itemData) => async (dispatch) => {
    try {
        const response = await fetch(`/api/history/${itemData.id}`, {
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

export const removeHistoryItem = (itemId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/history/${itemId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            dispatch(deleteHistoryItem(itemId));
        } else {
            const errorData = await response.json();
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
                item.id === action.item.id ? action.item : item
            );
        case DELETE_HISTORY_ITEM:
            return state.filter(item => item.id !== action.itemId);
        default:
            return state;
    }
}
