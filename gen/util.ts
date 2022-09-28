import {Structure} from "./types";

export function toPascalCase(string) {
	return `${string}`
		.toLowerCase()
		.replace(new RegExp(/[-_]+/, 'g'), ' ')
		.replace(new RegExp(/[^\w\s]/, 'g'), '')
		.replace(
			new RegExp(/\s+(.)(\w*)/, 'g'),
			($1, $2, $3) => `${$2.toUpperCase() + $3}`
		)
		.replace(new RegExp(/\w/), s => s.toUpperCase());
}


export function getFieldTsType(field: Structure): string {
	if (field.type === 'array' && field.sub_type !== null) {
		return getPrimitiveType(field.type, toPascalCase(extractRecord(field.sub_type)));
	}

	if (field.type.startsWith('record(')) {
		return toPascalCase(extractRecord(field.type));
	}

	return getPrimitiveType(field.type);
}

export function extractRecord(str: string) {
	if (!str.startsWith('record(')) {
		return str;
	}

	return str.replace('record(', '')
		.replace(')', '');
}

export function getPrimitiveType(type: string, generic?: string) {
	switch (type) {
		case "any":
			return "any";
		case "string":
			return "string";
		case "uuid":
			return "string";
		case "int":
		case "number":
			return "number";
		case "boolean":
		case "bool":
			return "boolean";
		case "time":
			return "string";
		case "datetime":
			return "Date";
		case "array" :
			return generic ? `Array<${generic}>` : "Array<any>";
		case "object":
			return "[{key:string}: any]";
		default:
			return "unknown";
	}
}
