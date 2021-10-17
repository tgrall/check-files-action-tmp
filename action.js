const core = require('@actions/core');
const github = require('@actions/github');


const action = async () => {    
    const githubToken = core.getInput('github_token');
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

    const octokit = new github.GitHub(githubToken);

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

    const result = await octokit.pulls.update(params);
    core.setOutput("result", JSON.stringify(result.data));
}

module.exports = action;
