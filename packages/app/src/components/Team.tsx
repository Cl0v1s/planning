import React from 'react';
import ReactDOM from 'react-dom';
import { useAppState } from '../reducers/reducers';
import { DatePicker } from './DatePicker';


export const Team = () => {
    const [dirty, setDirty] = React.useState(false);
    const { state } = useAppState();
    const [pickerAnchor, setPickerAnchor] = React.useState<HTMLElement>();


    const onSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback((e) => {

        setDirty(false);
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
                                <tr>
                                    <td className='p-1' >{ person.name }</td>
                                    <td className='p-1 flex items-center gap-2'>
                                        {
                                            person.unavailable.map((span) => <div>{ span.start.toLocaleDateString() } - { span.end.toLocaleDateString() }</div>)
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </form>
            {
                pickerAnchor && ReactDOM.createPortal(<DatePicker anchor={pickerAnchor} />, document.body)
            }
        </>
    )



};