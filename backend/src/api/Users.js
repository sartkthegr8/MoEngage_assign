const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/UsersModel");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const UsersVerifications = require("../models/UserVerificationModel");
const path = require("path");
const PasswordReset = require("../models/PasswordResetModel");

require("dotenv").config();

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for Email");
  }
});

// Utility functions
const validateInput = ({ name, email, password, dob }) => {
  if (!name || !email || !password || !dob) {
    return "Empty input fields!";
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return "Invalid name entered!";
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return "Invalid email entered!";
  }
  if (!new Date(dob).getTime()) {
    return "Invalid date of birth entered!";
  }
  // if (
  //   !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
  //     password
  //   )
  // ) {
  //   return "Password is short!";
  // }
  return null;
};

const handlePendingResponse = (res, message) => {
  res.json({
    status: "PENDING",
    message,
  });
};

const handleErrorResponse = (res, message) => {
  res.json({
    status: "FAILED",
    message,
  });
};

const handleSuccessResponse = (res, message, data = null) => {
  res.json({
    status: "SUCCESS",
    message,
    data,
  });
};

const sendVerificationEmail = (result, res) => {
  const { _id, email, name } = result;
  //url to be used in the email
  let url = process.env.HOST_URI || "http://localhost:5000";
  const uniqueId = uuidv4() + _id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color: #333;
      }
      .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      }
      .header {
        text-align: center;
        padding: 10px 0;
        border-bottom: 1px solid #dddddd;
        }
        .header h1 {
      margin: 0;
      color: #4CAF50;
      }
      .content {
        padding: 20px;
        }
        .content p {
          line-height: 1.6;
          }
          .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            }
            .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #777777;
      }
      .footer a {
      color: #4CAF50;
      text-decoration: none;
      }
  </style>
</head>
<body>
<div class="container">
<div class="header">
<h1>Welcome</h1>
</div>
<div class="content">
<p>Hello ${name},</p>
<p>Thank you for signing up. Please click the button below to verify your email address and complete your registration:</p>
<a href="${
      url + "/user/verify/" + _id + "/" + uniqueId
    }" class="button">Verify Your Email</a>
  <p>If you did not create an account, no further action is required.</p>
  <p>Thank you.</p>
  <p>Link will expire in 6 hours.</p>
  </div>
  <div class="footer">
  <p>If you're having trouble clicking the "Verify Your Email" button, copy and paste the URL below into your web browser:</p>
  <p><a href="${url + "/user/verify/" + _id + "/" + uniqueId}">${
      url + "/user/verify/" + _id + "/" + uniqueId
    }</a></p>
    <p>&copy; 2024 All rights reserved.</p>
    </div>
    </div>
    </body>
    </html>
    `,
  };

  const saltRounds = 10;
  bcrypt
    .hash(uniqueId, saltRounds)
    .then((hashValue) => {
      // set value in userVerification
      const newVerification = new UsersVerifications({
        userId: _id,
        uniqueId: hashValue,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      });

      newVerification
        .save()
        .then((response) => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              return handlePendingResponse(res, "Verification email sent.");
            })
            .catch((err) => {
              console.log(err);
              handleErrorResponse(res, "Failed to send verification mail");
            });
        })
        .catch((err) => {
          console.log(err);
          handleErrorResponse(res, "Saving verification details failed");
        });
    })
    .catch((err) => {
      console.log(err);
      handleErrorResponse(res, "An error occured while hashing the uniqueid");
    });
};

//verify user
router.get("/verify/:userId/:uniqueId", async (req, res) => {
  let { userId, uniqueId } = req.params;

  UsersVerifications.find({ userId })
    .then((result) => {
      if (result.length) {
        // user verification record found
        const { expiresAt } = result[0];
        const hashedUniqueId = result[0].uniqueId;
        // if link is expired
        if (expiresAt < Date.now()) {
          UsersVerifications.deleteOne({ userId })
            .then((dataResult) => {
              User.deleteOne({ userId })
                .then(() => {
                  let message = "Link has expired. Please Sign up again";
                  res.redirect(`/user/verified/error=true&message=${message}`);
                })
                .catch((error) => {
                  console.log(error);
                  let message =
                    "Error occured while clearing the already verifed user.";
                  res.redirect(`/user/verified/error=true&message=${message}`);
                });
            })
            .catch((error) => {
              console.log(error);
              let message =
                "Error occured while clearing the expired user verification link.";
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        } else {
          //has valid verification record
          //compare unique id
          bcrypt
            .compare(uniqueId, hashedUniqueId)
            .then((responseData) => {
              if (responseData) {
                User.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    UsersVerifications.deleteOne({ userId })
                      .then(() => {
                        res.sendFile(
                          path.join(__dirname, "./../assets/verified.html")
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                        let message = "User verification failed.";
                        res.redirect(
                          `/user/verified/error=true&message=${message}`
                        );
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    let message =
                      "An error occured while updating the verification details.";
                    res.redirect(
                      `/user/verified/error=true&message=${message}`
                    );
                  });
              } else {
                // incorrect verification details
                let message = "Invalid verification details. Check your inbox.";
                res.redirect(`/user/verified/error=true&message=${message}`);
              }
            })
            .catch((err) => {
              console.log(err);
              let message = "An error occured while comparing unique id";
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        }
      } else {
        let message =
          "Account is already verified or doesn't exist. Please log in or signup.";
        res.redirect(`/user/verified?error=true&message=${message}`);
      }
    })
    .catch((err) => {
      console.log(err);
      let message = "An error occured while verifying the user.";
      res.redirect(`/user/verified/error=true&message=${message}`);
    });
});

//verified user
router.get("/verified", async (req, res) => {
  res.sendFile(path.join(__dirname, "./../assets/verified.html"));
});

// Sign Up Route
router.post("/signup", async (req, res) => {
  let { name, email, password, dob } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  dob = dob.trim();

  const errorMessage = validateInput({ name, email, password, dob });
  if (errorMessage) {
    return handleErrorResponse(res, errorMessage);
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return handleErrorResponse(res, "User already exists.");
    }

    const saltRounds = 10;
    const hashPass = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      email,
      password: hashPass,
      dob,
      verified: false,
    });
    newUser.save().then((result) => {
      // handle verification
      sendVerificationEmail(result, res);
    });
    // return handleSuccessResponse(res, "Signup Successful.", savedUser);
  } catch (err) {
    return handleErrorResponse(res, "Failed to create user.");
  }
});

// Signin Route
router.post("/signin", async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (!email || !password) {
    return handleErrorResponse(res, "Invalid Credentials!");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return handleErrorResponse(res, "Invalid credentials!");
    }

    // if user is verified
    if (!user.verified) {
      return handleErrorResponse(
        res,
        "Email hasn't been verified yet. Please check your email."
      );
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return handleSuccessResponse(res, "Signin Successful", user);
      } else {
        return handleErrorResponse(res, "Invalid password!");
      }
    }
  } catch (err) {
    return handleErrorResponse(res, "Failed to get user details!");
  }
});

// reset password request
router.post(`/request/reset/password`, async (req, res) => {
  const { email, redirectUrl } = req.body;
  User.find({ email })
    .then((data) => {
      if (data.length) {
        // user exists then check if verified
        if (!data[0].verified) {
          return handleErrorResponse(
            res,
            "Email hasn't been verified yet. Check your email!"
          );
        } else {
          sendResetEmail(data[0], redirectUrl, res);
        }
      } else {
        return handleErrorResponse(res, "No account is found for given email!");
      }
    })
    .catch((err) => {
      console.log(err);
      return handleErrorResponse(res, "Failed to reset password!");
    });
});

//reset password
router.post(`/reset/password`, async (req, res) => {
  const { userId, resetId, newPassword } = req.body;
  PasswordReset.find({ userId })
    .then((result) => {
      const hashResetId = result[0].uniqueResetId;
      if (result.length) {
        if (result[0].expiresAt < Date.now()) {
          PasswordReset.deleteOne({ userId })
            .then(() => {
              return handleErrorResponse(res, "Password reset link expired!");
            })
            .catch((err) => {
              console.log(err);
              return handleErrorResponse(
                res,
                "Failed to clear existing requuests for password reset!"
              );
            });
        } else {
          // valid reset request
          bcrypt
            .compare(resetId, hashResetId)
            .then((result) => {
              if (result) {
                const saltRounds = 10;
                bcrypt
                  .hash(newPassword, saltRounds)
                  .then((hashedPassword) => {
                    User.updateOne(
                      { _id: userId },
                      { password: hashedPassword }
                    )
                      .then(() => {
                        PasswordReset.deleteOne({ userId })
                          .then(() => {
                            return handleSuccessResponse(
                              res,
                              "Password has been reset successfully"
                            );
                          })
                          .catch((err) => {
                            console.log(err);
                            return handleErrorResponse(
                              res,
                              "Failed to update password!"
                            );
                          });
                      })
                      .catch((err) => {
                        console.log(err);
                        return handleErrorResponse(
                          res,
                          "Failed to update password!"
                        );
                      });
                  })
                  .catch((err) => {
                    return handleErrorResponse(
                      res,
                      "An error occured while hashing the password!"
                    );
                  });
              } else {
                return handleErrorResponse(
                  res,
                  "Invalid password details passed!"
                );
              }
            })
            .catch((err) => {
              console.log(err);
              return handleErrorResponse(res, "Invalid reset request!");
            });
        }
      } else {
        return handleErrorResponse(res, "Password reset request not found!");
      }
    })
    .catch((err) => {
      console.log(err);
      return handleErrorResponse(res, "Password reset request not found!");
    });
});

// email to send when reset is requested
const sendResetEmail = (result, redirectUrl, res) => {
  const { _id, email } = result;
  const resetId = uuidv4() + _id;

  PasswordReset.deleteMany({ userId: _id })
    .then((response) => {
      //url to be used in the email
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Password Reset",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f6f6f6;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #4CAF50;
            color: #ffffff;
        }
        .content {
            padding: 20px;
            color: #333333;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            color: #ffffff;
            background-color: #4CAF50;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            color: #999999;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            .container {
                padding: 10px;
            }
            .button {
                padding: 10px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hi there,</p>
            <p>You recently requested to reset your password for your account. Click the button below to reset it.</p>
            <a href=${
              redirectUrl + "/" + _id + "/" + resetId
            } class="button">Reset Your Password</a>
            <p>If you did not request a password reset, please ignore this email or reply to let us know.</p>
            <p>Thanks</p>
        </div>
        <div class="footer">
            <p>If you’re having trouble with the button above, copy and paste the URL below into your web browser:</p>
            <p><a href=${redirectUrl + "/" + _id + "/" + resetId}>${
          redirectUrl + "/" + _id + "/" + resetId
        }</a></p>
            <p>©2024 All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
      };

      const saltRounds = 10;
      bcrypt
        .hash(resetId, saltRounds)
        .then((hashResetValue) => {
          const newPasswordRecord = new PasswordReset({
            userId: _id,
            uniqueResetId: hashResetValue,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
          });

          newPasswordRecord
            .save()
            .then(() => {
              transporter
                .sendMail(mailOptions)
                .then(() => {
                  return handlePendingResponse(
                    res,
                    "Password reset email sent."
                  );
                })
                .catch((err) => {
                  console.log(err);
                  handleErrorResponse(
                    res,
                    "Failed to send password reset mail"
                  );
                });
            })
            .catch((err) => {
              console.log(err);
              return handleErrorResponse(
                res,
                "Failed to create password reset link!"
              );
            });
        })
        .catch((err) => {
          console.log(err);
          return handleErrorResponse(
            res,
            "Failed to create password reset link!"
          );
        });
    })
    .catch((err) => {
      console.log(err);
      return handleErrorResponse(
        res,
        "Failed to clear existing reset password links!"
      );
    });
};

module.exports = router;
