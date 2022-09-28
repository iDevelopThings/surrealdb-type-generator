import {Thing, ThingId, ThingTable} from "./Thing";

type Constructor<T = { prototype: any }> = {
	new(...args: any[]): T;
	new<T>(...args: any[]): T;
	prototype: T
};

class RecordBase<T extends { id?: string }> {
	public recordId: Thing<T['id']>;

	constructor(...args: any[]) {
		Object.assign(this, ...args);

		const idField = (this as any).id;
		if (idField && typeof idField === 'string') {
			this.recordId     = new Thing(idField);
		}
	}
}

export type RecordBaseType<T extends { [key: string]: any }> = Partial<T> & typeof RecordBase<T>['prototype']; //Constructor<T & typeof RecordBase['prototype']>;

export function Record<T>(data: Partial<T>): RecordBaseType<T> {
	return new RecordBase<T>(data) as unknown as RecordBaseType<T>;
}

export type ThingType<T extends string> = T extends `${infer Tbl}:${infer Id}` ? Thing<T> : T;

export type RecordType<T> = {
	[K in keyof T]: T[K] extends string ? ThingType<T[K]> | string : T[K];
};

