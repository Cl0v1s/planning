import React from 'react';
import ReactDOM from 'react-dom';
import { useAppState } from '../reducers/reducers';
import { DatePicker } from './DatePicker';
import { DateSpan, Person } from '@planning/lib';
import { DateRange, Matcher } from 'react-day-picker';


export const Team = () => {
    const [dirty, setDirty] = React.useState(false);
    const { state } = useAppState();
    const [pickerAnchor, setPickerAnchor] = React.useState<HTMLElement>();
    const [dates, setDates] = React.useState<DateRange | undefined>();


    const onSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback((e) => {

        setDirty(false);
    }, []);

    const onPicker = React.useCallback((e: MouseEvent, span: DateSpan) => {
        setDates({ from: span.start, to: span.end});
        setPickerAnchor(e.currentTarget as HTMLElement);
    }, []);

    const onClosePicker = React.useCallback(() => {
        setPickerAnchor(undefined);
        setDates(undefined);
    }, []);

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
                        </tr>
                    </thead>
                    <tbody>
                        {
                            state.config.team.map((person) => (
                                <tr key={person.name}>
                                    <td className='p-1' >{ person.name }</td>
                                    <td className='p-1 flex items-center gap-2'>
                                        {
                                            person.unavailable.map((span) => <button key={`${span?.start?.toLocaleDateString()}-${span?.end?.toLocaleDateString()}`} type="button" onClick={(e: unknown) => onPicker(e as MouseEvent, span)}>{ span.start.toLocaleDateString() } - { span.end.toLocaleDateString() }</button>)
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </form>
            {
                pickerAnchor && ReactDOM.createPortal(<DatePicker onClose={onClosePicker} key={`${dates?.from?.toLocaleDateString()}-${dates?.to?.toLocaleDateString()}`} mode="range" selected={dates} defaultMonth={dates?.from} numberOfMonths={dates?.from?.getMonth() !== dates?.to?.getMonth() ? 2 : 1} anchor={pickerAnchor} />, document.body)
            }
        </>
    )



};