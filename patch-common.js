const fs = require('node:fs');

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

processFile('./build/plugins/all-deps/overrides.mk', [	{
	search: /-Dpdfium=disabled\s*\\/g,
	replace: `-Dpdfium=disabled \\\n    -Djpeg-xl-module=disabled \\`,
}]);
console.log(fs.readFileSync('./build/plugins/all-deps/overrides.mk', 'utf8'));


processFile('./build/overrides.mk', [	{
	search: /-Dc_link_args=\'\$\(LDFLAGS\)\s*-lntdll\s*-luserenv'\s*\\/g,
	replace: `-Dc_link_args='$(LDFLAGS) -Wl,--allow-multiple-definition -lntdll -luserenv' \\`,
}]);
console.log(fs.readFileSync('./build/overrides.mk', 'utf8'));