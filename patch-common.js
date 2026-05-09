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
	else
	{
		throw new Error('Not updated');
	}
}

// Disable the JPEG XL module
processFile('./build/plugins/all-deps/overrides.mk', [	{
	search: /-Dpdfium=disabled\s*\\/g,
	replace: `-Dpdfium=disabled \\\n    -Djpeg-xl-module=disabled \\`,
}]);

// Fix build failures by duplicate symbol
processFile('./build/overrides.mk', [	{
	search: /-Dc_link_args=\'\$\(LDFLAGS\)\s*-lntdll\s*-luserenv'\s*\\/g,
	replace: `-Dc_link_args='$(LDFLAGS) -Wl,--allow-multiple-definition -lntdll -luserenv' \\`,
}]);

// Enable AV1 high bit-depth support
processFile('./build/aom.mk', [	{
	search: /AV1_HIGHBITDEPTH=0/g,
	replace: `AV1_HIGHBITDEPTH=1`,
}]);