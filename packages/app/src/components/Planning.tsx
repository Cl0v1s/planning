import React from 'react';
import ReactDOM from 'react-dom';

import { useAppState } from '../reducers/reducers';

import { Order, Person, Role, planning } from '@planning/lib';

import { DatePicker } from './DatePicker';
import { DateRange } from 'react-day-picker';

import { Article, Button, Icon } from '@synapse-medicine/boto/platform';
import { icnArrowLineRight } from '@synapse-medicine/boto/goodmed/icons';


interface Slot {
    start: Date, end: Date, person: Person, role: Role
}

export const Planning = () => {
    const { state } = useAppState();
    const [slots, setSlots] = React.useState<Array<Array<Slot>>>([]);
    const [orders, setOrders] = React.useState<Array<Order>>();
    const [range, setRange] = React.useState<DateRange | undefined>(undefined);
    const [pickerAnchor, setPickerAnchor] = React.useState<HTMLElement | null>(null);


    const onGenerate = React.useCallback(() => {
        if(!range || !range.from || !range.to) return;
        const orders = planning(range?.from, range.to, state.config.team, state.config.roles);
        setOrders(orders);

        const sortedOrders = (orders.map((o) => {
            const wO = {...o};
            const { person } = wO;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (wO as any).person;
            const slots = Object.values(wO);
            return slots.flat().map((s) => ({ ...s, person }));
        })
        .flat() as Array<Slot>)
        .sort((a, b) => a.start.getTime() - b.start.getTime());


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
    }, [range, state.config.roles, state.config.team]);

    const onSetRange: React.MouseEventHandler = React.useCallback((e) => {
        setPickerAnchor(e.target as HTMLButtonElement);
    }, []);

    return (
        <div>
            <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex my-2 gap-2 align-items-end'>
                    <div>
                        <label className='d-block mb-1' htmlFor='from'>
                            <Article variant="semibold">
                                From:
                            </Article>
                        </label>
                        <input type="text" id="from" name="from" value={range?.from?.toLocaleDateString()} />
                    </div>
                    <div>
                        -
                    </div>
                    <div>
                        <label className='d-block mb-1' htmlFor='to'>
                            <Article variant="semibold">
                                To:
                            </Article>
                        </label>
                        <input type="text" id="to" name="to" value={range?.to?.toLocaleDateString()} />
                    </div>
                    <Button variant="secondary-basic" onClick={onSetRange}>Set range</Button>
                </div>
                <Button onClick={onGenerate}><Icon icon={icnArrowLineRight} color /> Generate Planning</Button>
            </div>
            <table>
                <tr>
                    {
                        slots.map((s) => <td className='p-2'>{s.map((ss) => <div>{ ss.start.toLocaleDateString() } - { ss.end.toLocaleDateString() } = { ss.person.name } as { ss.role.name }</div>)}</td>)
                    }
                </tr>
            </table>
            {
                orders && orders.length > 0 && (
                    <div>
                    <h2>Stats</h2>
                    <div className='flex gap-4 items-center'>
                        {
                            orders?.map((o) => (
                                <div>
                                    <span>{ o.person.name }</span>
                                    <ul className='pl-3'>
                                    {
                                        Object.keys(o).filter((k) => k !== "person").map((k) => (
                                            <li>{ k }: { (o[k] as Array<never>).length}</li>
                                        ))
                                    }
                                    </ul>
                                </div>
                            ))
                        }
                    </div>
                </div>
                )
            }
            {
                pickerAnchor && ReactDOM.createPortal(<DatePicker onClose={() => setPickerAnchor(null)} showOutsideDays fixedWeeks mode="range" selected={range}  onSelect={setRange} defaultMonth={new Date()} numberOfMonths={2} anchor={pickerAnchor} />, document.body)
            }
        </div>
    )
};
