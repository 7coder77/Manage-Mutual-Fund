const Investment = require('../models/Investment');
const { fetchNAVData } = require('../services/mutualFundService');

// GET /api/investments
exports.getAllInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({});
    for (let inv of investments) {
      const nav = await fetchNAVData(inv.fundCode);
      if (nav) {
        inv.currentNAV = nav.nav;
        inv.lastUpdated = new Date();
        await inv.save();
      }
    }
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching investments' });
  }
};

// POST /api/investments
exports.addInvestment = async (req, res) => {
  try {
    const { fundName, fundCode, amountInvested, purchaseNAV, purchaseDate } = req.body;
    const unitsAllotted = amountInvested / purchaseNAV;

    const navData = await fetchNAVData(fundCode);

    const investment = new Investment({
      fundName,
      fundCode,
      amountInvested,
      purchaseNAV,
      unitsAllotted,
      currentNAV: navData?.nav || purchaseNAV,
      purchaseDate
    });

    await investment.save();
    res.status(201).json(investment);
  } catch (err) {
    res.status(400).json({ message: 'Error creating investment', error: err.message });
  }
};

// GET /api/investments/portfolio-summary
exports.getPortfolioSummary = async (req, res) => {
  try {
    const investments = await Investment.find({});
    let totalInvested = 0;
    let currentValue = 0;

    for (let inv of investments) {
      totalInvested += inv.amountInvested;
      currentValue += inv.currentNAV * inv.unitsAllotted;
    }

    const profitLoss = currentValue - totalInvested;

    res.json({
      totalInvested,
      currentValue,
      profitLoss,
      profitLossPercentage: ((profitLoss / totalInvested) * 100).toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating summary' });
  }
};
