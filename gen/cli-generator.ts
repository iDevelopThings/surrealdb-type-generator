import {Command} from 'commander';
import {Generator} from "./generator";

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

const generator = new Generator({
	output,
	db : {
		namespace,
		database,
		user,
		pass,
		host,
	},
});

generator.process()
	.then(() => console.log('Finished.'))
	.catch(err => console.error(err));
