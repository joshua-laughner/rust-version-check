const core = require('@actions/core');
const toml = require('toml');
const fs = require('fs');

try {
    const release_tag = process.argv[2];
    //const release_tag = core.getInput('release-tag');
    console.log(`Release tag = ${release_tag}`);
    fs.readFile('Cargo.toml', 'utf-8', function(err, data) {
        if(err) throw err;
        //console.log('OK');
        //console.log(data);
        cargo_config = toml.parse(data);
        crate_version = cargo_config.package.version;
        console.log(`Crate version = ${crate_version}`);

        try {
            const result = check_tag(release_tag, crate_version);
        } catch (chk_err) {
            // this isn't triggering the outer catch
            console.log(chk_err)
            throw chk_err;
        }
        
        if (result) {
            console.log('Matches!');
        }else{
            console.log('No match :(');
        }
    });
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
    return release_tag.includes(crate_version);
}

function check_strict(release_tag, crate_version) {
    const prefix = process.argv[4];
    const suffix = process.argv[5];
    const release_regex = new RegExp(`${prefix}${crate_version}${suffix}`);
    console.log(release_regex);
    return release_regex.test(release_tag);
}