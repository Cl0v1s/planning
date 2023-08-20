import { CONFIG_FETCH, CONFIG_FETCH_FAIL, CONFIG_FETCH_SUCCESS, CONFIG_UPDATE } from "../actions/config";
import { Person, Role } from '@planning/lib';
import { Action, DispatchAction } from "../types/base";

export type ConfigState = {
    roles: Array<Role>,
    team: Array<Person>
};

type ConfigAction = Action & ConfigState;

export const state: ConfigState = {
    roles: [],
    team: [],
}


function sanitizeRole(role: Role): Role {
    let fullTime = false;
    if(role.fullTime === true || role.fullTime as unknown === 'on') fullTime = true;
    return {
        ...role,
        duration: Number(role.duration),
        fullTime,
    }
} 

function sanitizeTeam(person: Person) {
    return person;
}

function sanitizeConfig(config: ConfigState): ConfigState {
    return {
        ...config,
        team: config.team.map(sanitizeTeam),
        roles: config.roles.map(sanitizeRole),
    };
}

export function reducer(state: ConfigState, _dispatch: DispatchAction, action: ConfigAction) {
    switch(action.type) {
        case CONFIG_FETCH_FAIL:
        case CONFIG_FETCH:
            return state;
        case CONFIG_FETCH_SUCCESS:
        case CONFIG_UPDATE:
            return sanitizeConfig({ ...state, roles: action.roles, team: action.team })
    }
}