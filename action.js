const core = require('@actions/core');
const github = require('@actions/github');


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

    const createCheckRequest = {
        ...github.context.repo,
        "My Check",
        head_sha,
        status,
        conclusion,
        output: {
            title,
            summary: "Tug's summary",
            annotations: "Tug Annotations"
        }    
    };

    core.info(JSON.stringify(createCheckRequest, null, 2));
    await octokit.checks.create(createCheckRequest);



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
