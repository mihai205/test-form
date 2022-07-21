export interface IEmployer {
	name: string;
	start_date: any;
	end_date: any;
}

export interface IGuarantor {
	name?: string;
	address?: string;
	relation?: string;
}

export interface IInitialValues {
	first_name: string;
	last_name: string;
	current_address: string;
	employer: IEmployer[];
	guarantor?: IGuarantor;
}