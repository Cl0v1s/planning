import React from 'react';
import * as config from './config';
import { Action, DispatchAction, GlobalDispatch } from '../types/base';

const DEFAULT_STATE = {
    config: config.state,
}

export type State = typeof DEFAULT_STATE;

const REDUCERS = {
    config: config.reducer,
}

type Context = {
    state: State,
    dispatch: GlobalDispatch,
}

const DEFAULT_CONTEXT: Context = {
    state: DEFAULT_STATE,
    dispatch: () => { console.error('Please call dispatch only in an <AppStateProvider> child.')},
}

const AppState = React.createContext(DEFAULT_CONTEXT);


export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = React.useState<State>(DEFAULT_STATE);

    const dispatchAction = React.useCallback((action:Action) => {
        const wState: State = JSON.parse(JSON.stringify(state));
        Object.keys(REDUCERS).forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (wState as any)[key] = (REDUCERS as any)[key]((wState as any)[key], dispatchAction, action);
        });
        setState(wState);
    }, []);

    const dispatch = React.useCallback((fn: (state: State, dispatch: DispatchAction) => void) => {
            const wState: State = JSON.parse(JSON.stringify(state));
            fn(wState, dispatchAction);
    }, []);

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