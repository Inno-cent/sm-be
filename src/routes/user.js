const { Router } = require("express");

const router = Router();

router.use("/", (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "You must be logged in",
    });
  }
  return next();
});

router.get("/", async (req, res) => {
  try {
    const userDetails = await Users.findById(req?.user?._id);

    return res.status(200).json({
      message: "User details retrieved successfully",
      data: {
        fullname: userDetails.fullname,
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber,
        address: userDetails.address,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving user details",
      error: err.message,
    });
  }
});

module.exports = router;
