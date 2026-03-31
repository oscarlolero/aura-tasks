function mapStatus(labelNames) {
  let status = { text: 'In progress', color: 'gold' };

  if (labelNames.includes('Ready for QA')) status = { text: 'In review', color: 'teal' };
  if (labelNames.includes('Status: Done')) status = { text: 'Prod', color: 'red' };
  if (labelNames.includes('blocked')) status = { text: 'Blocked', color: 'gray' };
  if (labelNames.includes('Ready To Prod')) status = { text: 'Ready To Prod', color: 'teal' };

  return status;
}

function mapPriority(labelNames) {
  let priority = { emoji: '', weight: 0 };

  if (labelNames.includes('Priority: High')) priority = { emoji: '🟠', weight: 3 };
  if (labelNames.includes('Priority: Medium')) priority = { emoji: '🟡', weight: 2 };
  if (labelNames.includes('Priority: Low')) priority = { emoji: '🟢', weight: 1 };

  return priority;
}

function enrichIssues(rawIssues, timelines) {
  const timelinesMap = new Map(timelines.map((t) => [t.issue_number, t.related_prs]));

  return rawIssues
    .map((issue) => {
      const labelNames = issue.labels.map((l) => l.name);
      const status = mapStatus(labelNames);
      const priority = mapPriority(labelNames);
      const related_prs = timelinesMap.get(issue.number) || [];

      return {
        issue_number: issue.number,
        issue_title: issue.title,
        issue_url: issue.html_url,
        status,
        priorityEmoji: priority.emoji,
        priorityWeight: priority.weight,
        related_prs,
      };
    })
    .sort((a, b) => b.priorityWeight - a.priorityWeight);
}

module.exports = { enrichIssues };
