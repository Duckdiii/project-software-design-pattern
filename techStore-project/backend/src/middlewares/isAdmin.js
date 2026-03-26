const isAdmin = (req, res, next) => {
  // TODO: implement admin check (Task 3.1)
  next();
};

module.exports = { isAdmin };