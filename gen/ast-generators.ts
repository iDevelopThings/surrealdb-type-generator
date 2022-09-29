import * as ts from "typescript";
import {factory, InterfaceDeclaration, TypeAliasDeclaration, TypeElement} from "typescript";
import {ProcessedStructure} from "./types";

export function createTablesMap(models: [table: string, modelName: string][]): TypeAliasDeclaration {
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

export function createModelInterface(modelName: string, fields: readonly TypeElement[]): InterfaceDeclaration {
	return factory.createInterfaceDeclaration(
		[factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		factory.createIdentifier(modelName),
		undefined,
		undefined,
		fields
	);
}

export function createField(field: ProcessedStructure): TypeElement {
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
