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
		throw new Error('Not updated: ' + filePath);
	}
}

// Enable JPEG XL
processFile('./build/plugins/web-deps/overrides.mk', [	{
	search: /-Djpeg-xl=disabled/g,
	replace: `-Djpeg-xl-module=disabled`,
}]);

// Enable OpenJPEG
processFile('./build/plugins/web-deps/overrides.mk', [	{
	search: /-Dopenjpeg=disabled/g,
	replace: `-Dopenjpeg=enabled`,
}]);

// Add libjxl to vips.mk
processFile('./build/vips.mk', [	{
	search: /libimagequant highway cgif uhdr/g,
	replace: `libimagequant highway cgif uhdr libjxl openjpeg`,
}]);

// Extracted from: https://github.com/libvips/build-win64-mxe/pull/87/changes
// Tarball: https://github.com/libjxl/libjxl/tarball/v0.11.2
/*processFile('./build/libjxl.mk', [	{
	search: /\$\(PKG\)_VERSION[\s\S]*\$\(PKG\)_PATCHES/g,
	replace: `$(PKG)_VERSION  := 0.11.2
$(PKG)_CHECKSUM := 893ff1d9203ea2e211240c99ae5924f8b55fbcffb1339cae627f9acac5d7ec5c
$(PKG)_PATCHES`,
}]);*/

// Extracted from: https://github.com/libvips/build-win64-mxe/pull/87/changes
// Tarball: https://github.com/libjxl/libjxl/tarball/c0667f8efb1b533089192f7783bd2eee78d787ac
processFile('./build/libjxl.mk', [	{
	search: /\$\(PKG\)_VERSION[\s\S]*\$\(PKG\)_DEPS/g,
	replace: `$(PKG)_VERSION  := c0667f8
$(PKG)_CHECKSUM := 72a31652d1d9567800c0e4e6b22265c6474e4931543638826901f2db1fc00fb9
$(PKG)_PATCHES  := $(realpath $(sort $(wildcard $(dir $(lastword $(MAKEFILE_LIST)))/patches/$(PKG)-[0-9]*.patch)))
$(PKG)_GH_CONF  := libjxl/libjxl/branches/main
$(PKG)_DEPS`,
}]);

// Extracted from: https://github.com/libvips/build-win64-mxe/pull/87/changes
processFile('./build/libjxl.mk', [	{
	search: /-DJPEGXL_ENABLE_TRANSCODE_JPEG=OFF\s*\\/g,
	replace: `-DJPEGXL_ENABLE_TRANSCODE_JPEG=OFF \\
        $(if $(call seq,aarch64,$(PROCESSOR)), \\
            -DJPEGXL_ENABLE_HWY_SVE2_128=OFF \\
            -DJPEGXL_ENABLE_HWY_SVE_256=OFF \\
            -DJPEGXL_ENABLE_HWY_SVE2=OFF \\
            -DJPEGXL_ENABLE_HWY_SVE=OFF \\
            -DJPEGXL_ENABLE_HWY_NEON_BF16=OFF \\
            -DJPEGXL_ENABLE_HWY_NEON=OFF \\
            -DJPEGXL_ENABLE_HWY_NEON_WITHOUT_AES=ON \\
        $(else), \\
            -DJPEGXL_ENABLE_HWY_AVX10_2=OFF \\
            -DJPEGXL_ENABLE_HWY_AVX3_SPR=OFF \\
            -DJPEGXL_ENABLE_HWY_AVX3_ZEN4=OFF \\
            -DJPEGXL_ENABLE_HWY_AVX3_DL=OFF \\
            -DJPEGXL_ENABLE_HWY_AVX3=OFF \\
            -DJPEGXL_ENABLE_HWY_AVX2=ON \\
            -DJPEGXL_ENABLE_HWY_SSE4=OFF \\
            -DJPEGXL_ENABLE_HWY_SSSE3=OFF \\
            -DJPEGXL_ENABLE_HWY_SSE2=ON) \\
        -DJPEGXL_ENABLE_HWY_EMU128=OFF \\
        -DJPEGXL_ENABLE_HWY_SCALAR=OFF \\`,
}]);

// Fix build failures by duplicate symbol
processFile('./build/overrides.mk', [	{
	search: /-Dc_link_args=\'\$\(LDFLAGS\)\s*-lntdll\s*-luserenv'\s*\\/g,
	replace: `-Dc_link_args='$(LDFLAGS) -Wl,--allow-multiple-definition -lntdll -luserenv' \\`,
}]);

// Enable AV1 high bit-depth support (Technically no longer necessary since https://github.com/libvips/build-win64-mxe/pull/96)
processFile('./build/aom.mk', [	{
	search: /AV1_HIGHBITDEPTH=0/g,
	replace: `AV1_HIGHBITDEPTH=1`,
}]);