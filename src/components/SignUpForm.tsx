import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import classnames from "classnames";
import differenceInYears from "date-fns/differenceInYears";
import { IInitialValues } from "./interfaces";
import { Employer } from "./Employer";

import "./SignUpForm.modules.scss";
import { addCandidate } from "../api/employer";

export const SignUpForm = () => {
	const [needsGuarantor, setNeedsGuarantor] = useState<boolean>(false);

	let guarantorValidationSchema = {};

	if (needsGuarantor) {
		guarantorValidationSchema = {
			guarantor: Yup.object().shape({
				name: Yup.string()
					.max(25, "Min 25 characters")
					.required("Required"),
				address: Yup.string()
					.max(50, "Must be 50 characters or less")
					.required("Required"),
				relation: Yup.string()
					.max(20, "Must be 20 characters or less")
					.required("Required"),
			}),
		};
	}

	const SignupSchema = Yup.object({
		first_name: Yup.string()
			.max(15, "Must be 15 characters or less")
			.required("Required"),
		last_name: Yup.string()
			.max(20, "Must be 20 characters or less")
			.required("Required"),
		current_address: Yup.string()
			.max(50, "Must be 50 characters or less")
			.required("Required"),
		employer: Yup.array().of(
			Yup.object().shape({
				name: Yup.string()
					.min(4, "Min 4 characters")
					.required("Required"),
				start_date: Yup.date().required("Required"),
				end_date: Yup.date().nullable().required("Required"),
			})
		),
		...guarantorValidationSchema,
	});

	const initialValues: IInitialValues = {
		first_name: "",
		last_name: "",
		current_address: "",
		employer: [
			{
				name: "",
				start_date: undefined,
				end_date: undefined,
			},
		],
		guarantor: {
			name: "",
			address: "",
			relation: "",
		},
	};

	const checkIfNeedsGuarantor = (values: IInitialValues): void => {
		if (values.employer.length < 2) {
			return;
		}
		const totalEmployement = values.employer.reduce((prev, curr) => {
			const diffCurrent = differenceInYears(
				curr.end_date,
				curr.start_date
			);
			return prev + diffCurrent;
		}, 0);

		if (totalEmployement < 3) {
			setNeedsGuarantor(true);
		}
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={SignupSchema}
			onSubmit={async (values, { resetForm }) => {
				console.log("sss", values);
				try {
					const res = await addCandidate(values);
					console.log(res.json());
					resetForm();
				} catch (error) {
					console.error(error);
				}
			}}
		>
			{({ values }) => {
				checkIfNeedsGuarantor(values);

				return (
					<Form>
						<div className={classnames("card", "mb-4")}>
							<div className={classnames("card-body")}>
								<h2>Personal</h2>
								<div className="form-group">
									<label htmlFor="first_name">
										First Name
									</label>
									<Field
										className="form-control"
										name="first_name"
										type="text"
									/>
									<ErrorMessage
										component="span"
										className="error-message"
										name="first_name"
									/>
								</div>
								<div className="form-group">
									<label htmlFor="last_name">Last Name</label>
									<Field
										className="form-control"
										name="last_name"
										type="text"
									/>
									<ErrorMessage
										component="span"
										className="error-message"
										name="last_name"
									/>
								</div>
								<div className="form-group">
									<label htmlFor="current_address">
										Current Address
									</label>
									<Field
										className="form-control"
										name="current_address"
										type="text"
									/>
									<ErrorMessage
										component="span"
										className="error-message"
										name="current_address"
									/>
								</div>
							</div>
						</div>
						<div className={classnames("card", "mb-4")}>
							<div className={classnames("card-body")}>
								<h2>Employer</h2>
								<FieldArray
									name="employer"
									render={({ push, pop }) => {
										return (
											values?.employer?.length > 0 &&
											values?.employer.map(
												(employerItem, index) => (
													<Employer
														key={`employerItem-${index}`}
														index={index}
														employer={employerItem}
														pop={pop}
														push={push}
													/>
												)
											)
										);
									}}
								/>
							</div>
						</div>
						{needsGuarantor && (
							<div className={classnames("card", "mb-4")}>
								<div className={classnames("card-body")}>
									<h2>Guarantor</h2>
									<div className="form-group">
										<label htmlFor="guarantor.name">
											Name
										</label>
										<Field
											className="form-control"
											name="guarantor.name"
											type="text"
										/>
										<ErrorMessage
											component="span"
											className="error-message"
											name="guarantor.name"
										/>
									</div>
									<div className="form-group">
										<label htmlFor="guarantor.address">
											Address
										</label>
										<Field
											className="form-control"
											name="guarantor.address"
											type="text"
										/>
										<ErrorMessage
											component="span"
											className="error-message"
											name="guarantor.address"
										/>
									</div>
									<div className="form-group">
										<label htmlFor="guarantor.relation">
											Relation
										</label>
										<Field
											className="form-control"
											name="guarantor.relation"
											type="text"
										/>
										<ErrorMessage
											component="span"
											className="error-message"
											name="guarantor.relation"
										/>
									</div>
								</div>
							</div>
						)}

						<button
							type="submit"
							className={classnames("btn", "btn-primary")}
						>
							Submit
						</button>
					</Form>
				);
			}}
		</Formik>
	);
};
