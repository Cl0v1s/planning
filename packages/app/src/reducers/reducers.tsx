import React from 'react';
import * as config from './config';
import { Action, Dispatch } from '../types/base';

const DEFAULT_STATE: {[key: string]: unknown} = {
    config: config.state,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REDUCERS: {[key: string]: (state: any, dispatch: Dispatch, action: any ) => any } = {
    config: config.reducer,
}

type Context = {
    state: typeof DEFAULT_STATE,
    dispatch: Dispatch,
}

const DEFAULT_CONTEXT: Context = {
    state: DEFAULT_STATE,
    dispatch: () => { console.error('Please call dispatch only in an <AppStateProvider> child.')},
}

const AppState = React.createContext(DEFAULT_CONTEXT);


export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = React.useState<typeof DEFAULT_STATE>(DEFAULT_STATE);

    const dispatch = React.useCallback((action: Action) => {
        const wState: typeof DEFAULT_STATE = JSON.parse(JSON.stringify(state));
        Object.keys(REDUCERS).forEach((key) => {
            wState[key] = REDUCERS[key](wState[key], dispatch, action);
        });
        setState(wState);
    }, [state]);

    return (
        <AppState.Provider value={{state, dispatch}}>
            { children }
        </AppState.Provider>
    )

};

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState() {
    return React.useContext(AppState);
}