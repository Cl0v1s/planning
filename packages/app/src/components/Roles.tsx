import React, { FormEventHandler } from 'react';
import { Button, Article, Title, Icon } from '@synapse-medicine/boto/platform';
import { useAppState } from "../reducers/reducers";
import { Role } from '@planning/lib';
import { updateConfig } from '../actions/config';
import { icnAdd } from '@synapse-medicine/boto/platform/icons';

export const Roles = () => {
    const {state, dispatch} = useAppState();
    const [dirty, setDirty] = React.useState(false);
    const [roles, setRoles] = React.useState(state.config.roles);

    React.useEffect(() => {
        setRoles(state.config.roles);
    }, [state.config.roles]);

    const onDelete = React.useCallback((role: Role) => {
        setRoles(
            roles.filter((r) => r.name !== role.name)
        );
        setDirty(true);
    }, [roles]);

    const onSubmitAdd: React.FormEventHandler<HTMLFormElement> = React.useCallback((e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        
        const name = form.get('name')?.toString() || '';
        const duration = Number(form.get("duration")?.valueOf());
        const fullTime = !!form.get('fullTime')

        setRoles([
            ...roles,
            {
                duration,
                fullTime,
                name
            }
        ]);

        e.currentTarget.reset();
    }, [roles]);

    const onSubmit: FormEventHandler<HTMLFormElement> = React.useCallback((e) => {
        e.preventDefault();

        const wRoles = JSON.parse(JSON.stringify(roles)) as Array<Role>;
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
    }, [dispatch, roles, state.config.team]);

    return (
        <div className='d-block w-100'  onChange={() => setDirty(true)}>
            <form id="roles-new" onSubmit={onSubmitAdd} />
            <form id="roles-existing" onSubmit={onSubmit} />
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
                        <td className='border-bottom'></td>
                    </tr>
                </thead>
                <tbody>
                    {
                        roles.map((r, index) => (
                            <tr key={r.name}>
                                <td className="p-1">
                                    <input type='text' name={`${index}-name`} form="roles-existing" defaultValue={r.name} />
                                </td>
                                <td className="p-1">
                                    <input type='number' name={`${index}-duration`} form="roles-existing" defaultValue={r.duration} min={0} step={1} />
                                </td>
                                <td className="text-center p-1">
                                    <input type='checkbox' defaultChecked={r.fullTime} form="roles-existing" name={`${index}-fullTime`} />
                                </td>
                                <td className='text-right'>
                                    <Button variant="secondary-destructive" size={50} onClick={() => onDelete(r)}>Remove</Button>
                                </td>
                            </tr>
                        ))
                    }
                    <tr>
                        <td className='p-1'>
                            <input type="text" name="name" required form="roles-new"/>
                        </td>
                        <td className='p-1'>
                            <input type="number" min={2} max={363} required name="duration" form="roles-new"/>
                        </td>
                        <td className="text-center p-1">
                            <input type='checkbox'  name="fullTime" form="roles-new"/>
                        </td>
                        <td className='text-right'>
                            <Button type='submit' form="roles-new" variant="secondary-basic" size={50}>
                                <Icon icon={icnAdd} color />
                                Add role
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className='mt-2 text-right'>
                <Button type="submit" size={50} disabled={!dirty} form="roles-existing">
                    Save
                </Button>
            </div>

        </div>
    )
};