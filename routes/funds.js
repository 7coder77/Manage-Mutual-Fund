const express = require('express');
const router = express.Router();
const { fetchNAVData, searchFunds } = require('../services/mutualFundService');

// GET /api/funds/:code/nav
router.get('/:code/nav', async (req, res) => {
  try {
    const nav = await fetchNAVData(req.params.code);
    if (!nav) return res.status(404).json({ message: 'Fund not found' });
    res.json(nav);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching NAV' });
  }
});

// GET /api/funds/search?q=name
router.get('/search', async (req, res) => {
  try {
    const funds = await searchFunds(req.query.q);
    res.json(funds);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching funds' });
  }
});

module.exports = router;
