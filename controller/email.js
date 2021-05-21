"use strict";
require("dotenv").config();
let email = require("./src/mailer");

class emailController {
  async sendEmail(req, res) {
    let emailPtr = new email();
    await emailPtr.sendMail(req.body, res).then(()=> {
      res.json({
        message:'Email sent',
        request: req.body
      });
    });
  }
}

module.exports = new emailController();
