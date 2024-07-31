import { configureStore } from '@reduxjs/toolkit';
import idiomsReducer from './idioms';

const store = configureStore({
    reducer: {
        idioms: idiomsReducer,
    },
});

export default store;
