# GitHub action: Rust release version

When creating a new release of a Rust project, verify that the semantic version string in your
release tag matches the crate version defined in the Cargo.toml.

## Inputs

* `release-tag` (required): the tag associated with the new release.
* `cargo-toml-path` (optional): the path to the `Cargo.toml` file. The default is to assume it
  is in the current directory, i.e. `./Cargo.toml`.
* `check-mode` (optional): how the tag is checked. When this is "simple" (default), just verify
  that the crate version string is somewhere in the release tag. Setting this to "strict" allows
  you to define a regular expression that the release tag must match. The default regex is 
  "^{crate_version}$", so if the crate version is 1.0.0 this will be "^1.0.0$", meaning that the
  release tag must *exactly* match the crate version. This is modified with the `prefix` and `suffix`
  inputs.
* `prefix` (optional): only used with `check-mode = "strict"`, this sets the part of the regex
  before the crate version. By default this is "^", i.e. the beginning of the string.
* `suffix` (optional): like `prefix`, but the part of the regex after the crate version. The default
  is "$" i.e. the end of the string.