<br>

<p align="center">
    <a href="https://surrealdb.com#gh-dark-mode-only" target="_blank">
        <img width="300" src="https://raw.githubusercontent.com/surrealdb/surrealdb/bcac94f9d6ee154fd6ec2b5c0c910525b0c23b7a/img/white/logo.svg" alt="SurrealDB Logo">
    </a>
    <a href="https://surrealdb.com#gh-light-mode-only" target="_blank">
        <img width="300" src="https://raw.githubusercontent.com/surrealdb/surrealdb/bcac94f9d6ee154fd6ec2b5c0c910525b0c23b7a/img/black/logo.svg" alt="SurrealDB Logo">
    </a>
</p>


<h2>TypeScript Definition Generator</h2>

<p>
This package will allow you to generate type information from your well defined surrealdb tables :)
</p>

<p>
First of all, install the package: 
</p>

```bash
npm install surrealdb.types
yarn add surrealdb.types

# or install it globally

npm install -g surrealdb.types
yarn global add surrealdb.types
```

## Generating types:

#### Local package usage:

```bash
# This will generate the types into your current directory
./bin/surrealdb-types --namespace test --database application --user root --pass secret --host http://0.0.0.0:8000
# This will generate the types into your current directory as `db-types.d.ts`
./bin/surrealdb-types --output ./db-types.d.ts --namespace test --database application --user root --pass secret --host http://0.0.0.0:8000
```

#### Global package usage:

```bash
# This will generate the types into your current directory
surrealdb-types --namespace test --database application --user root --pass secret --host http://0.0.0.0:8000
# This will generate the types into your current directory as `db-types.d.ts`
surrealdb-types --output ./db-types.d.ts --namespace test --database application --user root --pass secret --host http://0.0.0.0:8000
```

## Programmatic usage:

```typescript 
import {Generator, Structure, ProcessedStructure} from "surrealdb.types/gen"
import * as ts from "typescript";

const generator = new Generator({
    output : './myname.d.ts'
    db : {
        namespace: 'test',
        database: 'application',
        user: 'root',
        pass: 'secret',
        host: 'http://0.0.0.0:4269',
    },
    tableNameFormatterFn: (name:string) => name.toUpperCase(),
    
    // Exclude admin tables?(example)
    allowGeneration: (tableName: string, structure: Structure[]) => tableName.includes('admin') === false,
    
    // Rename fields or modify their typescript types
    beforeTableGenerationFn?: (tableName: string, structure: ProcessedStructure[]) => {
        return structure.map(field => {
            field.name = 'randomly_renamed_field' + field.name
            return field;
        })
    },
    
    // You can modify the generated AST for everything here 
    // before it's output to the compiler
    beforeCompilationFn?: (input: ts.NodeArray<any>) => {
        // You can use https://ts-ast-viewer.com 
        // To enter some ts and get an AST version for ease of use.
        return input;
    }

});

// Finally we can run the generator
generator.process()
	.then(() => console.log('Finished.'))
	.catch(err => console.error(err));

```

### Configuration:
```typescript
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
```
