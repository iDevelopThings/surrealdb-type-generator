import {defineConfig} from 'vite';
import dts            from "vite-plugin-dts";

export default defineConfig({
	plugins : [
//		dts({
//			tsConfigFilePath : "./tsconfig.lib.json",
//			insertTypesEntry : true,
//			entryRoot: './lib/index.ts',
//			outputDir: `./dist/lib`,
//		}),
	],
	build   : {
		outDir        : 'dist/lib',
		sourcemap     : true,
		lib           : {
			name     : 'SDBTypes',
			entry    : './lib/index.ts',
			fileName : 'index',
			formats : ['es', 'cjs', 'umd', 'iife'],
		},
		rollupOptions : {
			external : [],
			output   : {
				globals : {},
			},
		},
	},
});
