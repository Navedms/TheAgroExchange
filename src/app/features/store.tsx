import {configureStore} from '@reduxjs/toolkit';

import itemsDataReducer from './itemsData/itemsDataSlice';

export const store = configureStore({
  reducer: {
    items: itemsDataReducer,
  },
});
