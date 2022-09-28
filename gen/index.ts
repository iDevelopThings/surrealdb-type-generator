import {InterfaceDeclaration, NodeArray, TypeAliasDeclaration, TypeElement} from "typescript";
import axios, {AxiosResponse} from 'axios';
import * as ts from "typescript";
import {factory} from "typescript";
import * as fs from "fs";
import {Command} from 'commander';
import {toPascalCase, getFieldTsType} from "./util";
import type {Structures, ProcessedStructure, Structure} from './types';

const program = new Command();

/**
 * NOTE:
 * This requires this PR for it to work, until it's merged:
 * https://github.com/surrealdb/surrealdb/pull/1241
 *
 * SIMPLE USAGE:
 * cd codegen
 * yarn / npm install
 *
 * ./node_modules/.bin/ts-node generate_types.ts --namespace test --database application --user root --pass secret --host http://0.0.0.0:4269
 *
 * You can generate to specific path:
 * ./node_modules/.bin/ts-node generate_types.ts --namespace test --database application --user root --pass secret --output ~/types.d.ts --host http://0.0.0.0:4269
 */

program
	.requiredOption('--namespace <namespace>', 'namespace name to use')
	.requiredOption('--database <database>', 'database name to use')
	.requiredOption('--user <user>', 'Root username to use', 'root')
	.requiredOption('--pass <pass>', 'Root password to use', 'root')
	.option('--output <output>', 'Path to output the typescript definition file', './models.d.ts')
	.option('--host <host>', 'The host of your surreal database', 'http://localhost:8000');

program.parse();

const options = program.opts<{
	namespace: string;
	database: string;
	user: string;
	pass: string;
	output: string;
	host: string,
}>();

const {namespace, database, user, pass, output, host} = options;

async function getStructures(): Promise<AxiosResponse<Structures>> {
	return await axios.post<Structures>(host + '/structure', undefined, {
		headers : {
			NS            : namespace,
			DB            : database,
			Accept        : 'application/json',
			Authorization : 'Basic ' + Buffer.from(user + ":" + pass).toString('base64'),
		},
	});
}

function createTablesMap(models: [table: string, modelName: string][]): TypeAliasDeclaration {
	return factory.createTypeAliasDeclaration(
		[factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		factory.createIdentifier("Tables"),
		undefined,
		factory.createTypeLiteralNode(
			models.map(([table, model]) => factory.createPropertySignature(
				undefined,
				factory.createIdentifier(table),
				undefined,
				factory.createTypeReferenceNode(
					factory.createIdentifier(model),
					undefined
				)
			))
		)
	);
}

function createModelInterface(modelName: string, fields: readonly TypeElement[]): InterfaceDeclaration {
	return factory.createInterfaceDeclaration(
		[factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		factory.createIdentifier(modelName),
		undefined,
		undefined,
		fields
	);
}

function createField(field: ProcessedStructure): TypeElement {
	return factory.createPropertySignature(
		undefined,
		factory.createIdentifier(field.name),
		undefined,
		factory.createTypeReferenceNode(
			factory.createIdentifier(field.type),
			undefined
		)
	);
}


function generateTableTypes(structures: Structures): ts.NodeArray<any> {
	const nodes: any[] = [];
	const models       = [];

	for (let key in structures) {
		const structureFields = structures[key];
		const modelName       = toPascalCase(key);

		const processedFields: ProcessedStructure[] = structureFields.map((field: Structure) => {
			return {
				name : field.name,
				type : getFieldTsType(field),
			};
		});
		processedFields.unshift({
			name : 'id',
			type : 'string',
		});

		const modelInterface = createModelInterface(modelName, processedFields.map(createField));
		models.push([key, modelName]);
		nodes.push(modelInterface);
	}


	nodes.push(createTablesMap(models));

	return ts.factory.createNodeArray(nodes);
}

async function process() {
	const structuresResponse = await getStructures();
	const structures         = structuresResponse.data;
	const nodes              = generateTableTypes(structures);

	const resultFile = ts.createSourceFile(
		"types.d.ts",
		"",
		ts.ScriptTarget.ES2022,
		/*setParentNodes*/ false,
		ts.ScriptKind.TS
	);

	const printer = ts.createPrinter({newLine : ts.NewLineKind.LineFeed});

	const result = printer.printList(
		ts.ListFormat.MultiLine,
		nodes,
		resultFile
	);


	fs.writeFileSync(output, result);

	console.log(result);
}


process().then(() => console.log('Finished.')).catch(err => console.error(err));
