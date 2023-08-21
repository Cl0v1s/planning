import React from 'react';
import { DayPicker, DayPickerDefaultProps , DayPickerSingleProps , DayPickerMultipleProps , DayPickerRangeProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type DayPickerProps = DayPickerDefaultProps | DayPickerSingleProps | DayPickerMultipleProps | DayPickerRangeProps;

type DatePickerProps = DayPickerProps & ({
    anchor: HTMLElement
});

export const DatePicker = ({ anchor, ...props }: DatePickerProps) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0});


    React.useEffect(() => {
        const { x, y } = anchor.getBoundingClientRect();
        setPosition({x, y});
    }, [anchor]);

    return (
        <div className={`fixed top-[${position.y}px] left-[${position.x}px]`}>
            <DayPicker
                {...props}
            />
        </div>
    );
};