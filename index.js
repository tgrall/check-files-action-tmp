const core = require('@actions/core');
const action = require('./action');







async function run() { 
  const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
  const { context = {} } = github;
  const { pull_request } = context.payload;

  if ( !pull_request ) {
    throw new Error('Could not find pull request!')
  };

  console.log(`Found pull request --->>>> ${pull_request.number}`);

  const octokit = github.getOctokit(GITHUB_TOKEN)

  await octokit.issues.createComment({
    ...context.repo,
    issue_number: pull_request.number,
    body: "Tug's comment"
  });




  // const result = await octokit.pulls.update(params);
  core.setOutput("result", "DONE");
}

run().catch(e => core.setFailed(e.message));
