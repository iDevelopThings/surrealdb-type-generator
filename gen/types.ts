export interface ProcessedStructure {
	name: string;
	type: string;
	original_type: string;
}

export type Structure = {
	name: string;
	type: string;
	sub_type: string | null;
}

export type Structures = { [key: string]: Structure[] };
