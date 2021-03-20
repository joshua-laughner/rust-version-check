const core = require('@actions/core');
const github = require('@actions/github');
const toml = require('toml');
const fs = require('fs');

try {
    // Might make more sense to get the release tag directly from the github
    // API (if possible) than to have it as an input.
//    const release_tag = core.getInput('release-tag');
    const release_tag = github.ref;
    console.log(`release tag is ${release_tag}`);
    const cargo_toml_path = core.getInput('cargo-toml-path');
    
    const data = fs.readFileSync(cargo_toml_path, 'utf-8');
    cargo_config = toml.parse(data);
    crate_version = cargo_config.package.version;
    
    const result = check_tag(release_tag, crate_version);
        
    if (result) {
        console.log('Release tag is consistent with the crate version!');
    }else{
        const msg = 'Release tag is NOT consistent with the crate version :('
        console.log(msg);
        core.setFailed(msg);
    }
    
} catch (error) {
    console.log('Setting that check failed')
    core.setFailed(error.message);
}

function check_tag(release_tag, crate_version) {
    const check_mode = core.getInput('check-mode');
    if (check_mode == 'strict') {
        return check_strict(release_tag, crate_version);
    }else if (check_mode == 'simple') {
        return check_simple(release_tag, crate_version);
    }else{
        throw new Error(`Unknown check_mode: "${check_mode}"`);
    }
}

function check_simple(release_tag, crate_version) {
    console.log(`Checking if crate version (${crate_version}) is contained in the release tag (${release_tag})`);
    return release_tag.includes(crate_version);
}

function check_strict(release_tag, crate_version) {
    const prefix = core.getInput('prefix');
    const suffix = core.getInput('suffix');
    const release_regex = new RegExp(`${prefix}${crate_version}${suffix}`);
    console.log(`Checking if release tag (${release_tag}) matches the regex ${release_regex}`);
    return release_regex.test(release_tag);
}
