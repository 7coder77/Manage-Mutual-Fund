const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  fundName: { type: String, required: true },
  fundCode: { type: String, required: true },
  amountInvested: { type: Number, required: true },
  purchaseNAV: { type: Number, required: true },
  unitsAllotted: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  currentNAV: { type: Number },
  lastUpdated: { type: Date }
});

investmentSchema.virtual('currentValue').get(function () {
  return this.currentNAV * this.unitsAllotted || 0;
});

investmentSchema.virtual('profitLoss').get(function () {
  return this.currentValue - this.amountInvested || 0;
});

investmentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Investment', investmentSchema);
