type Split<S extends string, D extends string> =
	string extends S ? string[] :
		S extends '' ? [] :
			S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

export type ExtractThing<T extends string> = Split<T, ':'>
export type ThingTable<T extends string> = ExtractThing<T>[0]
export type ThingId<T extends string> = ExtractThing<T>[1]

export class Thing<T extends string> {
	#table: ThingTable<T>;
	#id: ThingId<T>;

	constructor(thing: string);
	constructor(table: string, id: string);
	constructor(table: string, id?: string) {
		if (arguments.length === 1) {
			const [tbl, id] = table.split(':');
			this.#table     = tbl;
			this.#id        = id;
			return;
		}

		this.#table = table;
		this.#id    = id;
	}

	get table(): ThingTable<T> | string {
		return this.#table;
	}

	get id(): ThingId<T> | string {
		return this.#id;
	}

	get value(): `${ThingTable<T>}:${ThingId<T>}` | string {
		return `${this.#table}:${this.#id}`;
	}

	toString(): `${ThingTable<T>}:${ThingId<T>}` | string {
		return this.value;
	}
}
