const isAuthenticated = (req, res, next) => {
  if (req.session.user === undefined) {
    return res.status(401).json("Access denied. Please login.");
  }
  next();
};

module.exports = { isAuthenticated };