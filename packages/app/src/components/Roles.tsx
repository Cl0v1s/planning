import React, { FormEventHandler } from 'react';
import { Button, Article, Title } from '@synapse-medicine/boto/platform';
import { useAppState } from "../reducers/reducers";
import { Role } from '@planning/lib';
import { updateConfig } from '../actions/config';

export const Roles = () => {
    const {state, dispatch} = useAppState();
    const [dirty, setDirty] = React.useState(false);

    const onSubmit: FormEventHandler<HTMLFormElement> = React.useCallback((e) => {
        e.preventDefault();

        const wRoles = JSON.parse(JSON.stringify(state.config.roles)) as Array<Role>;
        const form = new FormData(e.currentTarget as HTMLFormElement);
        Array.from(form.keys()).reduce((acc, key) => {
            const [index, attr] = key.split('-');
            const wIndex = Number(index);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (acc[wIndex] as any)[attr] = form.get(key);
            return acc;
        }, wRoles);
        dispatch(updateConfig({ team: state.config.team, roles: wRoles }));
        setDirty(false);
    }, [dispatch, state.config.roles, state.config.team]);

    return (
        <form className='d-block w-100' onSubmit={onSubmit} onChange={() => setDirty(true)}>
            <div className='d-flex align-items-center gap-2'>
                <Title variant='h3'>
                    Roles
                </Title>
                {
                    dirty && (
                        <i>- edited</i>
                    )
                }
            </div>
            <table className="table-auto w-100 border rounded-50 p-2 my-3">
                <thead className="font-semibold">
                    <tr>
                        <td className='pb-2 border-bottom'><Article variant="semibold">Name</Article></td>
                        <td className='pb-2 border-bottom'><Article variant="semibold">duration (days)</Article></td>
                        <td className='pb-2 border-bottom'><Article variant="semibold">full time</Article></td>
                    </tr>
                </thead>
                <tbody>
                    {
                        state.config.roles.map((r, index) => (
                            <tr key={r.name}>
                                <td className="p-1">
                                    <input type='text' name={`${index}-name`} defaultValue={r.name} />
                                </td>
                                <td className="p-1">
                                    <input type='number' name={`${index}-duration`} defaultValue={r.duration} min={0} step={1} />
                                </td>
                                <td className="text-center p1">
                                    <input type='checkbox' defaultChecked={r.fullTime}  name={`${index}-fullTime`} />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className='mt-2 text-right'>
                <Button type="submit" size={50} disabled={!dirty}>
                    Save
                </Button>
            </div>

        </form>
    )

    return JSON.stringify(state.config);
};