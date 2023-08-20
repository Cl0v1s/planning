import React, { FormEventHandler } from 'react';
import { ConfigState } from "../reducers/config";
import { useAppState } from "../reducers/reducers";


export const Roles = () => {
    const {state} = useAppState();
    const config = state.config as ConfigState;

    const onSubmit: FormEventHandler = React.useCallback((e) => {
        e.preventDefault();
    }, []);

    return (
        <form onSubmit={onSubmit}>
            <h3>Roles</h3>
            <table className="table-auto">
                <thead className="font-semibold">
                    <tr>
                        <td>name</td>
                        <td>duration (days)</td>
                        <td>full time</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        config.roles.map((r, index) => (
                            <tr key={r.name} className="border-t">
                                <td className="p-1">
                                    <input type='text' name={`${index}-name`} value={r.name} />
                                </td>
                                <td className="p-1">
                                    <input type='number' name={`${index}-duration`} value={r.duration} min={0} step={1} />
                                </td>
                                <td className="text-center p1">
                                    <input type='checkbox' checked={r.fullTime} name={`${index}-fullTime`} />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </form>
    )

    return JSON.stringify(state.config);
};