import React from 'react';
import { Provider } from 'react-redux';
import { setupStore } from './redux/store';
import Routing from './routing/Routing';

function App() {
  return (
    <Provider store={setupStore()}>
      <Routing />
    </Provider>
  );
}

export default App;
