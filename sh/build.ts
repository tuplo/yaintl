import 'zx/globals';

async function main() {
	await $`rm -rf dist`;

	await $`tsc --build tsconfig.build.json`;
	await $`rm dist/index.js dist/*.tsbuildinfo`;
	await $`rm -rf dist/helpers`;

	const modes = ['cjs', 'esm'];
	for await (const mode of modes) {
		const flags = [
			'src/index.ts',
			'--bundle',
			`--format=${mode}`,
			'--platform=node',
			'--minify',
			`--outfile=dist/index.${mode}.js`,
		];

		await $`esbuild ${flags}`;
	}
}

main();
