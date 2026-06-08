# Custom `build-win64-mxe` build

Built from: [`libvips/build-win64-mxe`](https://github.com/libvips/build-win64-mxe)

`build-win64-mxe-custom` provides custom libvips binaries with:

- `JXL` built with `dynamic module: false`
- `JP2` support enabled
- ~~`AV1_HIGHBITDEPTH` enabled for 10/12-bit AVIF decoding~~ (Now included in the official `libvips/build-win64-mxe` builds since https://github.com/libvips/build-win64-mxe/pull/96)

> [!WARNING]
> Prefer the official `build-win64-mxe` builds unless you specifically need these features.