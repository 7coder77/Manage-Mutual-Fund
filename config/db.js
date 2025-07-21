const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://root:password@localhost:27017/mutualfunds', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin' // Important when using root user
});
    console.log('MongoDB connected 🥳🥳🥳');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
