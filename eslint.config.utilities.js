// A Utility File (e.g., eslint.config.utilities.js)

const RESTRICTED_DIRS = {
    "api": "@api",
    "detail": "@detail",
    "search": "@users",
    "utilities": "@utilities",
    "services": "@services"
};

/**
 * Generates ESLint config objects to restrict an alias within its own directory.
 * @param {string} directoryName - The directory name (e.g., 'detail').
 * @param {string} alias - The alias path (e.g., '@detail').
 */
function createInternalAliasRestriction(directoryName, alias) {
    return {
        // 1. Target files only inside the specific directory
        files: [`src/${directoryName}/**/*.{js,mjs,cjs}`],
        rules: {
            "no-restricted-imports": [
                "warn",
                {
                    patterns: [
                        {
                            // 2. Restrict the specific alias
                            group: [`${alias}/*`, alias],
                            message: `Use relative paths (e.g., './') for imports within the '${directoryName}' directory, not the absolute alias (${alias}).`,
                        },
                    ],
                },
            ],
        },
    };
}

// Generate the array of configurations
export const internalAliasRestrictions = Object.entries(RESTRICTED_DIRS).map(
    ([directory, alias]) => createInternalAliasRestriction(directory, alias)
);