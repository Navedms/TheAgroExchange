import React from 'react';
import {store} from './src/app/features/store';
import {Provider} from 'react-redux';

import SelectItemScreen from './src/app/screens/SelectItemScreen';

export default function App() {
  return (
    <Provider store={store}>
      <SelectItemScreen />
    </Provider>
  );
}
