const express = require('express');
const router = express.Router();
const {
  addInvestment,
  getAllInvestments,
  getPortfolioSummary
} = require('../controllers/investmentController');

router.get('/', getAllInvestments);
router.post('/', addInvestment);
router.get('/portfolio-summary', getPortfolioSummary);

module.exports = router;
