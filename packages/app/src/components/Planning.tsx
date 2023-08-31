import React from 'react';

import { useAppState } from '../reducers/reducers';

import { Person, Role, planning } from '@planning/lib';

interface Slot {
    start: Date, end: Date, person: Person, role: Role
}

export const Planning = () => {
    const { state } = useAppState();
    const [slots, setSlots] = React.useState<Array<Array<Slot>>>([]);


    const onGenerate = React.useCallback(() => {
        const start = new Date();
        const end = new Date();
        end.setMonth(start.getMonth() + 2);

        const orders = planning(start, end, state.config.team, state.config.roles)
            .map((o) => {
                const wO = {...o};
                const { person } = wO;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                delete (wO as any).person;
                const slots = Object.values(wO);
                return slots.flat().map((s) => ({ ...s, person }));
            })
            .flat() as Array<Slot>
        const sortedOrders = orders.sort((a, b) => a.start.getTime() - b.start.getTime());

        const clusters: Array<Array<Slot>> = [];
        do {
            const current = sortedOrders.shift();
            const cluster = [current as Slot];
            let same = -1;
            do {
                same = sortedOrders.findIndex((s) => current?.start.getTime() === s.start.getTime() && current.end.getTime() === s.end.getTime());
                if(same !== -1) {
                    cluster.push(sortedOrders[same]);
                    sortedOrders.splice(same, 1);
                }
            } while (same !== -1);
            clusters.push(cluster);
        } while (sortedOrders.length > 0);
        setSlots(clusters);
    }, [state.config.roles, state.config.team]);

    return (
        <div>
            <button type="button" onClick={onGenerate}>Generate Planning</button>
            <table>
                <tr>
                    {
                        slots.map((s) => <td className='p-2'>{s.map((ss) => <div>{ ss.start.toLocaleDateString() } - { ss.end.toLocaleDateString() } = { ss.person.name } as { ss.role.name }</div>)}</td>)
                    }
                </tr>
            </table>
        </div>
    )
};
