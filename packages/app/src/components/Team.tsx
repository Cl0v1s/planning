import React, { FormEventHandler } from 'react';
import ReactDOM from 'react-dom';
import { useAppState } from '../reducers/reducers';
import { DatePicker } from './DatePicker';
import { DateSpan, Person } from '@planning/lib';
import { DateRange } from 'react-day-picker';
import { updateConfig } from '../actions/config';
import { Button, Article, Title, Icon } from '@synapse-medicine/boto/platform';
import { icnPlus } from '@synapse-medicine/boto/platform/icons';

export const Team = () => {
    const [dirty, setDirty] = React.useState(false);
    const { state, dispatch } = useAppState();
    const [team, setTeam] = React.useState(state.config.team)
    const [pickerAnchor, setPickerAnchor] = React.useState<HTMLElement>();
    const [dates, setDates] = React.useState<DateRange | undefined>();
    const pickerCallback = React.useRef<null | ((e: DateRange) => void)>(null);

    React.useEffect(() => {
        setTeam(state.config.team);
    }, [state.config.team])

    const onDelete = React.useCallback((person: Person) => {
        setTeam(
            team.filter((t) => t.name !== person.name)
        )
        setDirty(true);
    }, [team]);


    const onSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback((e) => {
        e.preventDefault();
        dispatch(updateConfig({roles: state.config.roles, team}))
        setDirty(false);
    }, [dispatch, state.config.roles, team]);

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

    const onAddTeamMember: FormEventHandler<HTMLFormElement> = React.useCallback((e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');
        if(!name || team.find((t) => t.name === name.toString())) return;
        setTeam([
            ...team,
            { 
                name: name.toString(),
                unavailable: [],
            }
        ])
        setDirty(true);
        e.currentTarget.reset();
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
        setDirty(true);
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
            <form id="team-new" onSubmit={onAddTeamMember} />
            <form className='d-block w-100' onSubmit={onSubmit}>
                <div className='d-flex align-items-center gap-2'>
                    <Title variant="h3">
                        Team
                    </Title>
                    {
                        dirty && (
                            <div>
                                - Edited
                            </div>
                        )
                    }
                </div>
                <table className='table-auto w-100 border rounded-50 p-2 my-3'>
                    <thead>
                        <tr>
                            <td className='pb-2 border-bottom'>
                                <Article variant="semibold">
                                 name
                                </Article>
                            </td>
                            <td className='pb-2 border-bottom'>
                                <Article variant="semibold">
                                    unavailable
                                </Article>
                            </td>
                            <td className='pb-2 border-bottom'>

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
                                    <td className='p-1 d-flex gap-3 justify-content-end'>
                                        <Button variant="tertiary" size={50} onClick={(e: unknown) => onPicker(e as MouseEvent, person, null)}>
                                            Add dates
                                        </Button>
                                        <Button variant="secondary-destructive" size={50} onClick={() => onDelete(person)}>
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                        <tr>
                            <td className='p-1'>
                                <input type="text" form="team-new" name="name" />
                            </td>
                            <td>

                            </td>
                            <td className='p-1 text-right'>
                                <Button variant="secondary-basic" size={50} type="submit" form="team-new">
                                    <Icon icon={icnPlus} color />
                                    Add team member
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='text-right mt-2'>
                    <Button type='submit' size={50} disabled={!dirty}>
                        Save
                    </Button>
                </div>
            </form>
            {
                pickerAnchor && ReactDOM.createPortal(<DatePicker onClose={onClosePicker} key={`${dates?.from?.toLocaleDateString()}-${dates?.to?.toLocaleDateString()}`} showOutsideDays fixedWeeks mode="range" selected={dates}  onSelect={onSelect} defaultMonth={dates?.from} numberOfMonths={2} anchor={pickerAnchor} />, document.body)
            }
        </>
    )



};