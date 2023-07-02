const { Router } = require("express");
const { default: isEmail } = require("validator/lib/isEmail");
const Users = require("../models/user.model");
const { PhoneNumberUtil, PhoneNumberFormat } = require("google-libphonenumber");
const { hashSync, genSaltSync } = require("bcrypt");

const router = Router();

router.post("/register", async (req, res) => {
  try {
    let { fullname, email, password, phoneNumber } = req.body;

    if (phoneNumber[0] !== "+") {
      phoneNumber = "+" + phoneNumber;
    }

    email = email.toLowerCase();

    if (!fullname || !email || !password || !phoneNumber) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (!isEmail(email)) {
      return res.status(400).json({
        message: "Email is not valid",
      });
    }

    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parse(phoneNumber);
    if (!phoneUtil.isValidNumber(number)) {
      return res.status(400).json({
        message: "Phone number is not valid",
      });
    }

    const internationalNumber = phoneUtil.format(
      number,
      PhoneNumberFormat.E164
    );

    const userDetails = await Users.findOne({
      $or: [{ email }, { phoneNumber: internationalNumber }],
    });

    if (userDetails) {
      if (userDetails.email === email) {
        return res.status(400).json({
          message: "Email already used by another user",
        });
      }

      if (userDetails.phoneNumber === internationalNumber) {
        return res.status(400).json({
          message: "Phone number already used by another user",
        });
      }
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const newUser = new Users({
      fullname,
      email,
      password,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      status: "success",
    });

    //   va;idate phone number using google libphonenumber
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;