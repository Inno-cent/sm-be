const { Router } = require("express");

const router = Router();

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "You must be logged in",
    });
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "You must be logged in",
      });
    }

    req.user = decoded;

    return next();
  });
};

router.use("/auth", require("./auth"));

router.use("/user", authMiddleware, require("./user"));

module.exports = router;
