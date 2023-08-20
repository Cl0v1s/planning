import React from 'react';
import { Roles } from "./components/Roles";
import { AppStateProvider, useAppState } from "./reducers/reducers";
import { fetchConfig } from './actions/config';

function Starter({ children } : { children: React.ReactNode }) {
  const { dispatch } = useAppState();

  React.useEffect(() => {
    // fetch config
    fetchConfig(dispatch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}

function App() {
  return (
    <AppStateProvider>
      <Starter>
        <Roles />
      </Starter>
    </AppStateProvider>
  )
}

export default App
