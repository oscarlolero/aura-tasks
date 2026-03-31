const express = require('express');
const basicAuth = require('../middleware/basicAuth');
const { fetchIssues, fetchAllTimelines } = require('../services/github');
const { enrichIssues } = require('../utils/labelMapper');
const { buildHtml } = require('../utils/htmlBuilder');

const router = express.Router();

router.get('/daily', basicAuth, async (req, res) => {
  const { username, updatedFrom } = req.query;
  const filterEmpty = 'filter_empty' in req.query;
  const hidePRs = 'hide_prs' in req.query;

  if (!username) {
    return res.status(400).send('username query param is required');
  }

  try {
    const rawIssues = await fetchIssues(username, updatedFrom);
    const timelines = await fetchAllTimelines(rawIssues);
    const enriched = enrichIssues(rawIssues, timelines);
    const html = buildHtml(enriched, { filterEmpty, hidePRs });

    res.set('Content-Type', 'text/html; charset=utf-8').send(html);
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message;

    if (status === 429) {
      const retryAfter = err.response.headers['retry-after'];
      if (retryAfter) res.set('Retry-After', retryAfter);
      return res.status(429).send(`Rate limited: ${message}`);
    }

    const responseStatus = status && status < 500 ? status : 502;
    res.status(responseStatus).send(`Error: ${message}`);
  }
});

module.exports = router;
