import { IInitialValues } from "../components/interfaces";

export const addCandidate = (data: IInitialValues) =>
	fetch(`https://api/ref/new`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ...data }),
	});