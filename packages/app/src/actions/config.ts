import { Person, Role } from "@planning/lib";
import { State } from "../reducers/reducers";
import { DispatchAction } from "../types/base";

export const CONFIG_FETCH = 'CONFIG_FETCH';
export const CONFIG_FETCH_SUCCESS = 'CONFIG_FETCH_SUCCESS';
export const CONFIG_FETCH_FAIL = 'CONFIG_FETCH_FAIL';
export const CONFIG_UPDATE = 'CONFIG_UPDATE';

export const fetchConfig = () => async (_state: State, dispatch: DispatchAction) => {
    dispatch({ type: CONFIG_FETCH });

    try {
        const response = await fetch('/config.json');
        const data = await response.json();
        dispatch({ type: CONFIG_FETCH_SUCCESS, ...data });

    } catch (e) {
        dispatch({ type: CONFIG_FETCH_FAIL });
    }
}

export const updateConfig = ({ roles, team}: { roles: Array<Role>, team: Array<Person>}) => (_state: State, dispatch: DispatchAction) => {
    dispatch({ type: CONFIG_UPDATE, roles, team} as never)
}