export interface ProcessedStructure {
	name: string;
	type: string;
}

export type Structure = {
	name: string;
	type: string;
	sub_type: string | null;
}

export type Structures = { [key: string]: Structure[] };
