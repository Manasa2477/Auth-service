const { DB } = require("../config/dbStoreProcedure");
const { connect } = require("../config/sqlserver");
const sql = require("mssql");
const {
  Validatephno,
  Validationemail,
  Validatepin,
} = require("../config/validations");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { hashnumber } = require("../config/crypto");
const { v4: uuidv4 } = require("uuid");
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, "9876@#%@##!#", {
    expiresIn: "7d",
  });
  const refreshToken = jwt.sign({ id: userId }, "manasa!@!1311212", {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const login = async (req, res, next) => {
  try {
    const { phoneNumber, email } = req.body;
    var hashedPhonenumber = null;
    if (!phoneNumber && !email) {
      return res.json({ message: "getting Invalid phone number and email" });
    }
    if (phoneNumber) {
      if (!Validatephno(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
      } else {
        hashedPhonenumber = hashnumber(phoneNumber);
      }
    }
    if (email) {
      if (!Validationemail(email)) {
        return res.status(400).json({ message: "Invalid email" });
      }
    }
    const pool = await connect();
    const result = await pool
      .request()
      .input("phoneNumber", sql.VarChar, hashedPhonenumber || null)
      .input("email", sql.VarChar, email || null)
      .execute(DB.LOGIN_QUERY);
    const user = result.recordset[0];
    if (user) {
      return res.json({ message: "User exists", existed: true });
    } else {
      return res.json({ message: "User not found", existed: false });
    }
  } catch (err) {
    next(err);
  }
}; //update query

const verifypin = async (req, res, next) => {
  try {
    const { phoneNumber, pin } = req.body;
    var hashedPhonenumber = hashnumber(phoneNumber);
    const pool = await connect();
    const result = await pool
      .request()
      .input("phoneNumber", sql.VarChar, hashedPhonenumber)
      .input("pin", sql.VarChar, pin)
      .execute(DB.VERIFY_QUERY);
    const user = result.recordset[0];
    console.log(result,hashedPhonenumber);
    
    if (user) {
      const tokens = generateTokens(user.userId);
      return res.json({ message: "Login Succesfully", tokens });
    } else {
      return res.status(401).json({ message: "Login Failed" });
    }
  } catch (err) {
    next(err);
  }
};
const createpin = async (req, res, next) => {
  try {
    const { phoneNumber, pin, email } = req.body;
    var hashedPhonenumber = null;

    if (!phoneNumber && !email) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or email and pin is required" });
    }
    if (phoneNumber) {
      if (!Validatephno(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
      } else {
        hashedPhonenumber = hashnumber(phoneNumber);
      }
    }
    if (email) {
      if (!Validationemail(email)) {
        return res.status(400).json({ message: "Invalid email" });
      }
    }
    if (!Validatepin(pin)) {
      return res.status(400).json({ message: "pin is required" });
    }

    var userUniqueId = uuidv4();
    const pool = await connect();
    const result = await pool
      .request()
      .input("phoneNumber", sql.VarChar, hashedPhonenumber)
      .input("pin", sql.VarChar, pin)
      .input("userId", sql.VarChar, userUniqueId)
      .input("email", sql.VarChar, email)
      .execute(DB.CREATEPIN_QUERY);

    // Check if a row was inserted
    if (result.rowsAffected[0] === 1) {
      const tokens = generateTokens(userUniqueId);
      return res.json({
        message: "User created and logged in successfully",
        tokens,
      });
    } else {
      return res.status(500).json({ message: "User creation failed" });
    }
  } catch (error) {
    next(error);
  }
};
const resetpin = async (req, res, next) => {
  try {
    const { phoneNumber,pin } = req.body;
    var hashedPhonenumber = null;
    if (!phoneNumber && !pin) {
      return res.json({ message: "getting Invalid phone number and pin" });
    }
    if (phoneNumber) {
      if (!Validatephno(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
      } else {
        hashedPhonenumber = hashnumber(phoneNumber);
      }
    }

    const pool = await connect();
    const userDetails = await pool
      .request()
      .input("phoneNumber", sql.VarChar, hashedPhonenumber || null)
      .execute(DB.LOGIN_QUERY);
    if (userDetails.recordset.length > 0) {        
      const result = await pool
        .request()
        .input("pin", sql.VarChar, pin)
        .input("userId",sql.VarChar,userDetails.recordset[0].userId)
        .execute(DB.RESETPIN_QUERY);
      return res.status(200).json({ message: "User updated successfully" });
    } else {
      return res.status(409).json({ message: "User not found " });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  createpin,
  verifypin,
 resetpin

};
