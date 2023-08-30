import React from 'react';
import { Roles } from "./components/Roles";
import { AppStateProvider, useAppState } from "./reducers/reducers";
import { fetchConfig } from './actions/config';
import { Team } from './components/Team';

function Starter({ children } : { children: React.ReactNode }) {
  const { dispatch } = useAppState();

  React.useEffect(() => {
    // fetch config
    dispatch(fetchConfig());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}

function App() {
  return (
    <AppStateProvider>
      <Starter>
        <div className='flex justify-around gap-3'>
          <Roles />
          <Team />
        </div>
      </Starter>
    </AppStateProvider>
  )
}

export default App
