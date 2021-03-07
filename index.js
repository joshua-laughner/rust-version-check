const core = require('@actions/core');
const toml = require('toml');
const fs = require('fs');

try {
    const release_tag = process.argv[2];
    //const release_tag = core.getInput('release-tag');
    
    const data = fs.readFileSync('Cargo.toml', 'utf-8');//, function(err, data) {
    cargo_config = toml.parse(data);
    crate_version = cargo_config.package.version;
    
    const result = check_tag(release_tag, crate_version);
        
    if (result) {
        console.log('Matches!');
    }else{
        console.log('No match :(');
    }
    
} catch (error) {
    console.log('Setting that check failed')
    core.setFailed(error.message);
}

function check_tag(release_tag, crate_version) {
    const check_mode = process.argv[3];
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
    const prefix = process.argv[4];
    const suffix = process.argv[5];
    const release_regex = new RegExp(`${prefix}${crate_version}${suffix}`);
    console.log(`Checking if release tag (${release_tag}) matches the regex ${release_regex}`);
    return release_regex.test(release_tag);
}