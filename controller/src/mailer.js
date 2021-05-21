"use strict";
require("dotenv").config();
var nodemailer = require("nodemailer");

class Mailer {
  async getTransporter() {
    return nodemailer.createTransport({
      port: process.env.email_port || 587,
      host: process.env.email_host || "smtp.office365.com",
      auth: {
        user: process.env.email_username,
        pass: process.env.email_password,
      },
      secure: true,
    });
  }

  async prepareMail(from, to, subject, text, html) {
    return {
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };
  }

  async sendMail(params) {
    let mailTransporter = await this.getTransporter();
    mailTransporter.sendMail(
      this.prepareMail(
        params.from,
        params.to,
        params.subject,
        params.text,
        params.html
      ),
      function (err, info) {
        if (err) {
          console.dir(err);
        } else {
          console.dir(info);
        }
      }
    );
  }
}

module.exports = Mailer;
