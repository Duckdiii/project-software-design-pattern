const verifyToken = (req, res, next) => {
  // TODO: implement JWT verify (Task 3.1)
  next();
};

module.exports = { verifyToken };