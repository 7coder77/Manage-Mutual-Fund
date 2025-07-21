// routes/investments.js
const express = require('express');
const Investment = require('../models/Investment');
const { authenticateToken } = require('../middleware/auth');
const { fetchNAVData } = require('../services/mutualFundService');

const router = express.Router();

// Get all investments for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.id });
    
    // Update NAV data for all investments
    await Promise.all(investments.map(async (investment) => {
      const navData = await fetchNAVData(investment.fundCode);
      if (navData) {
        investment.currentNAV = navData.nav;
        investment.lastUpdated = new Date();
        await investment.save();
      }
    }));

    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching investments', error: error.message });
  }
});

// Add new investment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { fundName, fundCode, amountInvested, purchaseNAV, purchaseDate } = req.body;
    
    const unitsAllotted = amountInvested / purchaseNAV;
    
    const investment = new Investment({
      userId: req.user.id,
      fundName,
      fundCode,
      amountInvested,
      unitsAllotted,
      purchaseNAV,
      purchaseDate: new Date(purchaseDate)
    });

    // Fetch current NAV
    const navData = await fetchNAVData(fundCode);
    if (navData) {
      investment.currentNAV = navData.nav;
    }

    await investment.save();
    res.status(201).json(investment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating investment', error: error.message });
  }
});

// Get portfolio summary
router.get('/portfolio-summary', authenticateToken, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.id });
    
    const summary = investments.reduce((acc, investment) => {
      acc.totalInvested += investment.amountInvested;
      acc.currentValue += investment.currentValue;
      return acc;
    }, { totalInvested: 0, currentValue: 0, totalInvestments: investments.length });

    summary.totalProfitLoss = summary.currentValue - summary.totalInvested;
    summary.totalProfitLossPercentage = 
      ((summary.totalProfitLoss / summary.totalInvested) * 100).toFixed(2);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating portfolio summary', error: error.message });
  }
});

module.exports = router;
