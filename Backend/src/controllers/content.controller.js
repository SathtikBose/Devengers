const { getDailyQuote } = require("../services/daily-quote.service");

exports.getDailyQuote = (req, res) => {
  res.json(getDailyQuote());
};
