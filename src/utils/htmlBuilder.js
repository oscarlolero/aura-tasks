function buildHtml(enrichedIssues, { filterEmpty = false, hidePRs = false } = {}) {
  const items = enrichedIssues
    .filter((issue) => !filterEmpty || issue.related_prs.length > 0)
    .map((issue) => {
      const prsSection = hidePRs
        ? ''
        : ` (PRs: ${
            issue.related_prs.length
              ? issue.related_prs
                  .map((pr) => `<a href="${pr.pr_url}">#${pr.pr_number}</a>`)
                  .join(', ')
              : 'ninguno'
          })`;

      return `  <li>${issue.priorityEmoji} <a href="${issue.issue_url}">#${issue.issue_number}</a>: ${issue.issue_title} <span style="color:${issue.status.color};font-weight:bold;">(${issue.status.text})</span>${prsSection}</li>`;
    });

  return `<ul>\n${items.join('\n')}\n</ul>`;
}

module.exports = { buildHtml };
