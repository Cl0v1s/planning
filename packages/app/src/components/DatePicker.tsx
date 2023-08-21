import React from 'react';
import { DayPicker, DayPickerDefaultProps , DayPickerSingleProps , DayPickerMultipleProps , DayPickerRangeProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type DayPickerProps = DayPickerDefaultProps | DayPickerSingleProps | DayPickerMultipleProps | DayPickerRangeProps;

type DatePickerProps = DayPickerProps & ({
    anchor: HTMLElement,
    onClose: React.MouseEventHandler,
});

export const DatePicker = ({ anchor, onClose, ...props }: DatePickerProps) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0});
    const [rendered, setRendered] = React.useState(false);
    const root = React.useRef<HTMLDivElement>(null);

    const onClickOutSide = React.useCallback((e: React.MouseEvent<Element, MouseEvent>) => {
        if(root.current?.contains(e.target as Node)) return;
        if(onClose) onClose(e);
    }, [onClose]);

    React.useEffect(() => {
        if(root.current == null) return;
        // eslint-disable-next-line prefer-const
        let { x, y, width, height } = anchor.getBoundingClientRect();
        const { width: sWidth, height: sHeight } = root.current.getBoundingClientRect();
        x = Math.round(x + width / 2);
        y = Math.round(y + height / 2);
        if(x + sWidth > window.innerWidth) x = window.innerWidth - sWidth;
        if(y + sHeight > window.innerHeight) y = window.innerHeight - sHeight;
        setPosition({x, y});
    }, [anchor]);

    React.useEffect(() => {
        setTimeout(() => setRendered(true), 50);
    }, []);

    React.useEffect(() => {
        setTimeout(() => {
            window.addEventListener('click', onClickOutSide as never);
        }, 50);
        return () => {
            window.removeEventListener('click', onClickOutSide as never);
        }
    }, [onClickOutSide]);

    return (
        <div ref={root} className={`fixed bg-gray-900 rounded drop-shadow-md transition-opacity ${rendered ? 'opacity-100' : 'opacity-0'}`} style={{top: `${position.y}px`, left: `${position.x}px`}}>
            <DayPicker
                {...props}
            />
        </div>
    );
};