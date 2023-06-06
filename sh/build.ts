import { $ } from "@tuplo/shell";

async function main() {
	await $`rm -rf dist`;

	await $`tsc --build tsconfig.build.json`;
	await $`rm -rf dist/helpers`;

	const flags = ["--bundle", "--platform=node", "--minify"];
	await $`esbuild src/cjs/index.js --format=cjs --outfile=dist/index.cjs ${flags}`;
	await $`esbuild src/index.ts --format=esm --outfile=dist/index.mjs ${flags}`;
}

main();
