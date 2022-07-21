import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { IEmployer, IInitialValues } from "./interfaces";
import classnames from "classnames";
import { DatePickerField } from "./DatePickerField";
import startOfDay from "date-fns/startOfDay";
import isEqual from "date-fns/isEqual";
import differenceInYears from "date-fns/differenceInYears";

import "./Employer.modules.scss";

interface Props {
	index: number;
	employer: IEmployer;
	pop: <T>() => T | undefined;
	push: (obj: IEmployer) => void;
}

export const Employer = (props: Props) => {
	const { index, employer, pop, push } = props;
	const { values, setFieldValue } = useFormikContext();
	const [currentEmployer, setCurrentEmployer] = useState<boolean>(true);

	const { employer: employers } = values as IInitialValues;

	// populate end_date if currentEmployer is true on first employer
	useEffect(() => {
		if (index === 0) {
			setFieldValue(
				`employer.0.end_date`,
				currentEmployer ? startOfDay(new Date()) : null
			);
		}
	}, [currentEmployer, index, setFieldValue]);

	useEffect(() => {
		if (index === 0) {
			if (
				!isEqual(employer.start_date, employer.end_date) &&
				differenceInYears(employer.end_date, employer.start_date) < 3 &&
				employers.length === 1
			) {
				push({ name: "", start_date: undefined, end_date: undefined });
			}

			if (
				(isEqual(employer.start_date, employer.end_date) ||
					differenceInYears(employer.end_date, employer.start_date) >=
						3) &&
				employers.length > 1
			) {
				pop();
			}
		}
	}, [employer.end_date, employer.start_date, employers.length, index, pop, push]);

	return (
		<div className="employer-item">
			<div className="form-group">
				<label htmlFor={`employer.${index}.name`}>Name</label>
				<Field
					className="form-control"
					name={`employer.${index}.name`}
					type="text"
				/>
				<ErrorMessage
					component="span"
					className="error-message"
					name={`employer.${index}.name`}
				/>
			</div>
			<div className="row">
				<div className="col">
					<div className="form-group">
						<label htmlFor={`employer.${index}.start_date`}>
							Start date
						</label>
						<DatePickerField
							name={`employer.${index}.start_date`}
							value={employer?.start_date}
							className="form-control"
							onChange={setFieldValue}
						/>
						<ErrorMessage
							component="span"
							className="error-message"
							name={`employer.${index}.start_date`}
						/>
					</div>
				</div>

				<div
					className={classnames("col", {
						hide: currentEmployer && index === 0,
					})}
				>
					<div className="form-group">
						<label htmlFor={`employer.${index}.end_date`}>
							End date
						</label>
						<DatePickerField
							name={`employer.${index}.end_date`}
							value={
								currentEmployer && index === 0
									? new Date()
									: employer?.end_date
							}
							className="form-control"
							onChange={setFieldValue}
						/>
						<ErrorMessage
							component="span"
							className="error-message"
							name={`employer.${index}.end_date`}
						/>
					</div>
				</div>

				{index === 0 && (
					<div className={classnames("col", "check-align-col")}>
						<div className="form-check">
							<input
								className="form-check-input"
								type="checkbox"
								name="current_employer"
								checked={currentEmployer}
								onChange={() => {
									setFieldValue(
										`employer.${index}.end_date`,
										currentEmployer !== true
											? startOfDay(new Date())
											: null
									);
									setCurrentEmployer(!currentEmployer);
								}}
							/>
							<label
								className="form-check-label"
								htmlFor="current_employer"
							>
								Current employer
							</label>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
