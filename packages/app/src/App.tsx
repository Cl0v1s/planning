import React from 'react';
import { Roles } from "./components/Roles";
import { AppStateProvider, useAppState } from "./reducers/reducers";
import { fetchConfig } from './actions/config';
import { Team } from './components/Team';
import { Planning } from './components/Planning';
import 'react-router-dom';


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
    <div className='bg-brand-tertiary-light p-4' style={{minHeight: "100vh"}}>
      <AppStateProvider>
        <Starter>
          <div className='d-inline-flex p-3 gap-4 bg-white dp-25 rounded-100'>
            <Roles />
            <Team />
          </div>
          <Planning />
        </Starter>
      </AppStateProvider>
    </div>
  )
}

export default App
