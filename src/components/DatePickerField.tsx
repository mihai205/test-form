import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface IDatePickerField {
	name: string;
	value: Date | undefined;
	onChange: (name: string, val: Date | null) => void;
	className?: string;
	maxDate?: Date | null;
}

export const DatePickerField = (props: IDatePickerField) => {
	const { name, value, onChange, className, maxDate } = props;
	return (
		<DatePicker
			className={className}
			selected={(value && new Date(value)) || null}
			onChange={(val) => {
				onChange(name, val);
			}}
			maxDate={maxDate || new Date()}
		/>
	);
};
