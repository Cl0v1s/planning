import { CONFIG_FETCH, CONFIG_FETCH_FAIL, CONFIG_FETCH_SUCCESS } from "../actions/config";
import { Person, Role } from '@planning/lib';
import { Action, Dispatch } from "../types/base";

export type ConfigState = {
    roles: Array<Role>,
    team: Array<Person>
};

type ConfigAction = Action & ConfigState;

export const state: ConfigState = {
    roles: [],
    team: [],
}

export function reducer(state: ConfigState, _dispatch: Dispatch, action: ConfigAction) {
    switch(action.type) {
        case CONFIG_FETCH_FAIL:
        case CONFIG_FETCH:
            return state;
        case CONFIG_FETCH_SUCCESS:
            return { ...state, roles: action.roles, team: action.team }
    }
}