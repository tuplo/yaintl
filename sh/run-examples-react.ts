import shell from "@tuplo/shell";

async function main() {
	const $ = shell.$({ verbose: true });

	const flags = [
		"--bundle",
		"--loader:.js=jsx",
		"--outfile=examples/react/bundle.js",
		"--servedir=examples/react",
		"--watch",
	];
	await $`esbuild examples/react/index.tsx ${flags}`;
}

main();
