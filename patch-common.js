const fs = require('node:fs');
const p = require('node:path');

const BUILD_FILE_WINDOWS = process.argv[2] || 'build/win.sh';

function walk(dir, callback)
{
	const entries = fs.readdirSync(dir, {withFileTypes: true});

	for(const entry of entries)
	{
		const fullPath = p.join(dir, entry.name);

		// Skip .git
		if(entry.name === '.git')
			continue;

		if(fullPath.includes('/custom/patch-common.js') || fullPath.includes('/custom/.github'))
			continue;

		if(entry.isDirectory())
			walk(fullPath, callback);
		else if(entry.isFile())
			callback(fullPath);
	}
}

// Apply replacements to a file
function processFile(filePath, replacements)
{
	const content = fs.readFileSync(filePath, 'utf8');
	let updated = content;

	for(const {search, replace} of replacements)
	{
		updated = updated.replace(search, replace);
	}

	if(updated !== content)
	{
		fs.writeFileSync(filePath, updated, 'utf8');
		console.log(`Updated: ${filePath}`);
	}
}

const replacements = [];

replacements.push(
	{
		search: /-Dpdfium=disabled \\/g,
		replace: `-Dpdfium=disabled \\\n    -Djpeg-xl-module=disabled \\`,
	}
);

processFile('../build/plugins/all-deps/overrides.mk', replacements);

console.log(fs.readdirSync('../build/plugins/all-deps/overrides.mk', 'utf8'));