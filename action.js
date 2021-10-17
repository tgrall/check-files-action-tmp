const core = require('@actions/core');
const github = require('@actions/github');
const checks = require('./utils/checks');


const action = async () => {    
    const gitHubToken = core.getInput('github_token');
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const pull_number = core.getInput('pull_number');
    const branch = core.getInput('branch');
    const title = core.getInput('title');
    const body = core.getInput('body');
    const labels = core.getInput('labels');
    const assignees = core.getInput('assignees');
    const milestone = core.getInput('milestone');
    const state = core.getInput('state');
    const draft = core.getInput('draft');
    const maintainer_can_modify = core.getInput('maintainer_can_modify');
    const head = core.getInput('head');
    const base = core.getInput('base');


    const commit = core.getInput('commit');
    const pullRequest = github.context.payload.pull_request;
    const link = (pullRequest && pullRequest.html_url) || github.context.ref;    
    const name = core.getInput('check_name');
    const status = 'completed';
    const head_sha = commit || (pullRequest && pullRequest.head.sha) || github.context.sha;

    const conclusion =  "success";

    core.info(
        `Posting status '${status}' with conclusion '${conclusion}' to ${link} (sha: ${head_sha})`
    );
    const octokit = github.getOctokit(gitHubToken);

    const licenseExists = await checks.checkFileExistence("LICENSE");
    const readMeExists = await checks.checkFileExistence("README.md");

    // create a check for missing file
    let missingFileCheck = {
        ...github.context.repo,
        name : "Missing Files",
        head_sha : head_sha,
        status : "completed",
        conclusion : "success",
        output: {
            title : "Missing Files",
            summary: "The _Missing Files_ action has returned the following information: ",
            annotations: undefined, // no annotations we just want to raise some information
        } 
    }

    
    if (licenseExists) {
        missingFileCheck.output.summary = missingFileCheck.output.summary + "\n\n - ✅  *License* file found";
    } else {
        missingFileCheck.output.summary = missingFileCheck.output.summary + "\n\n - ⚠️  *License* file not found";
        missingFileCheck.conclusion = "neutral";
    }

    if (readMeExists) {
        missingFileCheck.output.summary = missingFileCheck.output.summary + "\n\n - ✅  *README.md* file found";

        // readme should start with a title
        const readMeTitle = await checks.checkStartsWithTitle();
        if (!readMeTitle) {
            console.error(  "readMeTitle is false");
        }

    } else {
        missingFileCheck.output.summary = missingFileCheck.output.summary + "\n\n - ⚠️  *README.md* file not found";
        missingFileCheck.conclusion = "neutral";
    }

    await octokit.rest.checks.create(missingFileCheck);



    /*
    const createCheckRequest = {
        ...github.context.repo,
        name : "Test Report",
        head_sha : head_sha,
        status,
        conclusion,
        output: {
            title,
            summary: "Tug's summary",
            annotations: [
                {
                path : "README.md",
                start_line: 1,
                end_line: 1,
                start_column: 2,
                end_column: 4,
                annotation_level: 'failure',
                title : "Error in readme",
                message : "this is invalid",
                raw_details: undefined                
                },
                // {
                //     // path : ".",
                //     // start_line: 0,
                //     // end_line: 0,
                //     // start_column: 0,
                //     // end_column: 0,
                //     annotation_level: 'notice',
                //     title : "No license",
                //     message : "Licence file should exist",
                //     //raw_details: undefined                
                //     }
            ],
        }    
    };

    core.info(JSON.stringify(createCheckRequest, null, 2));
    await octokit.rest.checks.create(createCheckRequest);

*/



 

    const params = {
        owner: owner,
        repo: repo,
        pull_number: pull_number,
        base: base,
        head: head,
        title: title,
        body: body,
        state: state,
        draft: draft,
        maintainer_can_modify: maintainer_can_modify,
        labels: labels,
        assignees: assignees,
        milestone: milestone
    };

    // const result = await octokit.pulls.update(params);
    core.setOutput("result", JSON.stringify(params));

}

module.exports = action;
