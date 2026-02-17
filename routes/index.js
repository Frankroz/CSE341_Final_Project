const router = require("express").Router();
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

router.get(
  "/login",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.redirect("/");
  });
});

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: true,
  }),
  (req, res) => {
    req.session.user = { id: req.user._id, displayName: req.user.displayName };
    res.redirect("/");
  },
);

router.use("/ingredients", require("./ingredient"));
router.use("/recipes", require("./recipe"));
router.use("/mealplans", require("./mealplan"));
router.use("/grocerylists", require("./groceryList"));

// Route for Swagger Documentation
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

module.exports = router;
