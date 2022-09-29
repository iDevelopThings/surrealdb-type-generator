import * as ts from "typescript";
import {ProcessedStructure, Structure} from "./types";
import {toPascalCase} from "./util";

export type SurrealDbConfig = {
	namespace: string;
	database: string;
	user: string;
	pass: string;
	host: string,
}


export type GeneratorConfig = {
	// Modify how table names are converted to model names
	// This is the name of the actual type
	tableNameFormatterFn?: (name: string) => string,

	// Add a hook to prevent a specific table from being generated
	// Returning false means it wont be generated
	allowGeneration?: (tableName: string, structure: Structure[]) => boolean,
	// Add a hook function to run some arbitrary code before the table AST is generated
	// This would allow you to adjust how types are formatted in the structure for example
	beforeTableGenerationFn?: (tableName: string, structure: ProcessedStructure[]) => ProcessedStructure[],

	// Add a function to modify/add/remove ts nodes, before they're sent to the compiler
	beforeCompilationFn?: (input: ts.NodeArray<any>) => ts.NodeArray<any>,

	db?: SurrealDbConfig,

	// The path to output the generated typescript file
	output: string;
}

export const defaultConfig: GeneratorConfig = {
	tableNameFormatterFn   : toPascalCase,
	allowGeneration        : (tableName: string, structure: Structure[]) => true,
	beforeTableGenerationFn : (tableName: string, structure: ProcessedStructure[]) => structure,
	beforeCompilationFn    : (input: ts.NodeArray<any>) => input,
	output                 : './models.d.ts',
};

export function combineConfig(config: GeneratorConfig): GeneratorConfig {
	return {
		...defaultConfig,
		...config,
	};
}
