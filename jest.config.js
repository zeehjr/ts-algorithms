import hq from "alias-hq";

export default {
	transform: {
		"\\.[jt]sx?$": [
			"esbuild-jest",
			{
				loaders: {
					".spec.js": "jsx",
					".js": "jsx",
				},
			},
		],
	},
	/// This will resolve any tsconfig.compilerOptions.paths
	moduleNameMapper: hq.get("jest"),
	testPathIgnorePatterns: ["/node_modules/", "/dist/", "/types/"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	reporters: [["<rootDir>/custom-reporter.js", { useReporter: true }]],
};
