import axios, {AxiosResponse} from "axios";
import fs from "fs";
import * as ts from "typescript";
import {createField, createModelInterface, createTablesMap} from "./ast-generators";
import {combineConfig, GeneratorConfig} from "./config";
import {ProcessedStructure, Structure, Structures} from "./types";
import {getFieldTsType} from "./util";

export class Generator {
	static config: GeneratorConfig;

	constructor(config: GeneratorConfig) {
		Generator.config = combineConfig(config);
	}

	get config() {
		return Generator.config;
	}

	async getStructures(): Promise<AxiosResponse<Structures>> {
		return await axios.post<Structures>(this.config.db.host + '/structure', undefined, {
			headers : {
				NS            : this.config.db.namespace,
				DB            : this.config.db.database,
				Accept        : 'application/json',
				Authorization : 'Basic ' + Buffer.from(this.config.db.user + ":" + this.config.db.pass).toString('base64'),
			},
		});
	}

	formatModelName(name: string): string {
		return this.config.tableNameFormatterFn(name);
	}

	generateTableTypes(structures: Structures): ts.NodeArray<any> {
		const f = (tableName: string, structure: ProcessedStructure[]) => {
			return structure.map(field => {
				field.name = 'randomly_renamed_field' + field.name
				return field;
			})
		}
		const nodes: any[] = [];
		const models       = [];

		for (let key in structures) {
			const structureFields = structures[key];
			const modelName       = this.formatModelName(key);

			if (!this.config.allowGeneration(key, structureFields)) {
				continue;
			}

			let processedFields: ProcessedStructure[] = structureFields.map((field: Structure) => {
				return {
					name          : field.name,
					type          : getFieldTsType(field),
					original_type : field.type,
				};
			});
			processedFields.unshift({
				name          : 'id',
				type          : 'string',
				original_type : 'string',
			});

			processedFields = this.config.beforeTableGenerationFn(key, processedFields);

			const modelInterface = createModelInterface(modelName, processedFields.map(createField));
			models.push([key, modelName]);
			nodes.push(modelInterface);
		}

		nodes.push(createTablesMap(models));

		return this.config.beforeCompilationFn(ts.factory.createNodeArray(nodes));
	}

	async process() {
		const structuresResponse = await this.getStructures();
		const structures         = structuresResponse.data;
		const nodes              = this.generateTableTypes(structures);

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

		fs.writeFileSync(this.config.output, result);

		console.log(result);
	}
}


