exports.errorHandler = (req, res) => {
  res.status(404).render("404", {
    isAuthenticated: req.isLoggedIn
  });
};
