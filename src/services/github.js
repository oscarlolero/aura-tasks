const axios = require('axios');

const REPO = 'Aura-Dev-Solutions/aura-frontend';

const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'aura-tasks',
  },
});

async function fetchIssues(username, updatedFrom) {
  let q = `repo:${REPO} is:issue archived:false assignee:${username} sort:updated-desc`;
  if (updatedFrom) q += ` updated:>=${updatedFrom}`;

  const res = await githubClient.get('/search/issues', { params: { q } });
  return res.data.items;
}

async function fetchTimeline(issueNumber) {
  const res = await githubClient.get(
    `/repos/${REPO}/issues/${issueNumber}/timeline`,
    { headers: { Accept: 'application/vnd.github.mockingbird-preview+json' } }
  );

  const prs = res.data
    .filter((event) => event.event === 'cross-referenced' && event.source?.issue?.pull_request)
    .map((event) => ({
      pr_number: event.source.issue.number,
      pr_url: event.source.issue.html_url,
    }));

  return { issue_number: issueNumber, related_prs: prs };
}

async function fetchAllTimelines(issues) {
  return Promise.all(issues.map((issue) => fetchTimeline(issue.number)));
}

module.exports = { fetchIssues, fetchAllTimelines };
