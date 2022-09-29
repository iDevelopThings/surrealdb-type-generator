
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
