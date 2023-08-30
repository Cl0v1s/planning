import React from 'react';
import ReactDOM from 'react-dom';
import { useAppState } from '../reducers/reducers';
import { DatePicker } from './DatePicker';
import { DateSpan, Person } from '@planning/lib';
import { DateRange } from 'react-day-picker';


export const Team = () => {
    const [dirty, setDirty] = React.useState(false);
    const { state } = useAppState();
    const [team, setTeam] = React.useState(state.config.team)
    const [pickerAnchor, setPickerAnchor] = React.useState<HTMLElement>();
    const [dates, setDates] = React.useState<DateRange | undefined>();
    const pickerCallback = React.useRef<null | ((e: DateRange) => void)>(null);

    React.useEffect(() => {
        setTeam(state.config.team);
    }, [state.config.team])


    const onSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback((e) => {

        setDirty(false);
    }, []);

    const onEditDateSpan = React.useCallback((person: Person, before: DateSpan, after: DateRange) => {
        const index = team.findIndex((t) => t.name === person.name)
        const wTeam = [...team];
        const unavailable = person.unavailable.filter((d) => d.start.getTime() !== before.start.getTime() || d.end.getTime() !== before.end.getTime());
        wTeam.splice(
            index, 
            1,
            {
               ...person,
                unavailable: [...unavailable, { start: after.from as Date, end: after.to as Date}]
            }
        );
        setTeam(wTeam);
    }, [team]);

    const onAddDateSpan = React.useCallback((person: Person, range: DateRange) => {
        const index = team.findIndex((t) => t.name === person.name)
        const wTeam = [...team];
        wTeam.splice(
            index, 
            1,
            {
               ...person,
               unavailable: [...person.unavailable, { start: range.from as Date, end: range.to as Date }]
            }
        );
        setTeam(wTeam);
    }, [team]);

    const onClosePicker = React.useCallback(() => {
        setPickerAnchor(undefined);
        setDates(undefined);
        pickerCallback.current = null;
    }, []);

    const onSelect = React.useCallback((range: DateRange | undefined) => {
        setDates(range);
        if(!pickerCallback.current || !range || !range.from || !range.to) return;
        pickerCallback.current(range);
    }, []);

    const onPicker = React.useCallback((e: MouseEvent, person: Person, span: DateSpan | null) => {
        setDates({ from: span?.start, to: span?.end});
        setPickerAnchor(e.currentTarget as HTMLElement);
        if(span) {
            pickerCallback.current = (range: DateRange) => onEditDateSpan(person, span, range);
        } else {
            pickerCallback.current = (range: DateRange) => onAddDateSpan(person, range);
        }
    }, [onAddDateSpan, onEditDateSpan]);


    return (
        <>
            <form onSubmit={onSubmit} onChange={() => setDirty(true)}>
                <div className='flex items-center gap-2'>
                    <h3>Team</h3>
                    {
                        dirty && (
                            <div>
                                - Edited
                            </div>
                        )
                    }
                </div>
                <table className='table-auto'>
                    <thead>
                        <tr>
                            <td className='pb-2'>
                                name
                            </td>
                            <td className='pb-2'>
                                unavailable
                            </td>
                            <td className='pb-2'>

                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            team.map((person) => (
                                <tr key={person.name}>
                                    <td className='p-1' >{ person.name }</td>
                                    <td className='p-1 flex items-center gap-2'>
                                        {
                                            person.unavailable.map((span) => <button key={`${span?.start?.toLocaleDateString()}-${span?.end?.toLocaleDateString()}`} type="button" onClick={(e: unknown) => onPicker(e as MouseEvent, person, span)}>{ span.start.toLocaleDateString() } - { span.end.toLocaleDateString() }</button>)
                                        }
                                    </td>
                                    <td>
                                        <button type="button" onClick={(e: unknown) => onPicker(e as MouseEvent, person, null)}>
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </form>
            {
                pickerAnchor && ReactDOM.createPortal(<DatePicker onClose={onClosePicker} key={`${dates?.from?.toLocaleDateString()}-${dates?.to?.toLocaleDateString()}`} showOutsideDays fixedWeeks mode="range" selected={dates}  onSelect={onSelect} defaultMonth={dates?.from} numberOfMonths={2} anchor={pickerAnchor} />, document.body)
            }
        </>
    )



};