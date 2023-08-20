import { Dispatch } from "../types/base";

export const CONFIG_FETCH = 'CONFIG_FETCH';
export const CONFIG_FETCH_SUCCESS = 'CONFIG_FETCH_SUCCESS';
export const CONFIG_FETCH_FAIL = 'CONFIG_FETCH_FAIL';

export async function fetchConfig(dispatch: Dispatch) {
    dispatch({ type: CONFIG_FETCH });

    try {
        const response = await fetch('/config.json');
        const data = await response.json();
        dispatch({ type: CONFIG_FETCH_SUCCESS, ...data });

    } catch (e) {
        dispatch({ type: CONFIG_FETCH_FAIL });
    }

}
