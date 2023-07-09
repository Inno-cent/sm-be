const { Router } = require("express");
const { default: isEmail } = require("validator/lib/isEmail");
const Users = require("../models/user.model");
const { PhoneNumberUtil, PhoneNumberFormat } = require("google-libphonenumber");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const router = Router();

router.post("/register", async (req, res) => {
  try {
    let { fullname, email, password, phoneNumber } = req.body;
    if (
      !fullname?.trim() ||
      !email?.trim() ||
      !password?.trim()
      // !phoneNumber?.trim()
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // if (phoneNumber[0] !== "+") {
    //   phoneNumber = "+" + phoneNumber;
    // }

    email = email.toLowerCase();

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

    // const phoneUtil = PhoneNumberUtil.getInstance();
    // const number = phoneUtil.parse(phoneNumber);
    // if (!phoneUtil.isValidNumber(number)) {
    //   return res.status(400).json({
    //     message: "Phone number is not valid",
    //   });
    // }

    // const internationalNumber = phoneUtil.format(
    //   number,
    //   PhoneNumberFormat.E164
    // );

    const userDetails = await Users.findOne({
      $or: [
        { email },
        // { phoneNumber: internationalNumber }
      ],
    });

    if (userDetails) {
      if (userDetails.email === email) {
        return res.status(400).json({
          message: "Email already used by another user",
        });
      }

      // if (userDetails.phoneNumber === internationalNumber) {
      //   return res.status(400).json({
      //     message: "Phone number already used by another user",
      //   });
      // }
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const newUser = new Users({
      fullname,
      email,
      password,
      // phoneNumber: internationalNumber,
      isAdmin: false,
      isEmailVerified: false,
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await Users.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      status: "success",
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
      status: "error",
    });
  }
});

module.exports = router;
