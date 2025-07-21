const axios = require('axios');
const BASE_URL = 'https://api.mfapi.in/mf';

exports.fetchNAVData = async (fundCode) => {
  try {
    const response = await axios.get(`${BASE_URL}/${fundCode}`);
    const latest = response.data?.data[0];
    return {
      nav: parseFloat(latest?.nav),
      date: latest?.date
    };
  } catch (err) {
    console.error('NAV fetch failed:', err.message);
    return null;
  }
};

exports.searchFunds = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search?q=${query}`);
    return response.data;
  } catch (err) {
    console.error('Fund search failed:', err.message);
    return [];
  }
};
