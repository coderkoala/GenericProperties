"use strict";
require("dotenv").config();
let nodemailer = require("nodemailer");
let logger = require("./logger");
let template = require("./emailTemplateHelper");

class Mailer {
  handleEmailResponse(errorResponse, response) {
    if (errorResponse) {
      logger.error(errorResponse);
      return false;
    } else {
      logger.info("[Success] Email dispatched successfully.");
      return response;
    }
  }

  async getTransporter(userSwitch = "default") {
    let user = process.env.email_username_default;
    let pass = process.env.email_password_default;
    let name = 'MSVProperties';

    switch (userSwitch) {
      case "sara":
        name = 'Sara Assaf';
        user = process.env.email_username_sara;
        pass = process.env.email_password_sara;
        break;
      case "tamara":
        name = 'Tamara Karic';
        user = process.env.email_username_tamara;
        pass = process.env.email_password_tamara;
        break;
      case "carlota":
        name = 'Carlota Panao';
        user = process.env.email_username_carlota;
        pass = process.env.email_password_carlota;
        break;
      case "admin":
        user = process.env.email_username_admin;
        pass = process.env.email_password_admin;
        break;
      case "default1":
        user = user;
        pass = pass;
        break;
      case "default2":
        user = process.env.email_username_default2;
        pass = process.env.email_password_default2;
        break;
      case "default":
        user = user;
        pass = pass;
        break;
    }

    this.mailSender = user || process.env.email_username_default;
    this.nameSender = name;

    return nodemailer.createTransport({
      port: process.env.email_port || 587,
      host: process.env.email_host || "smtp.office365.com",
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  prepareMail(from, to, subject, content, recipient = "") {
    let email = new template();
    return {
      from: from || process.env.email_username,
      to: to,
      subject: subject,
      html: email
        .getEmailBasic()
        .replace("{name}", ` ${recipient}`)
        .replace("{content}", content),
    };
  }

  async sendMail(req, res) {
    let error = "success";
    let response = {};
    if (!req.to || !req.to.length || req.to.length < 1) {
      error = "error";
      response = {
        title: "Invalid Receiver",
        message:
          "The recipient received invalid. Please try again with a valid receiver.",
        error: "error",
      };
    } else if (req.subject.match(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i)) {
      error = "error";
      response = {
        title: "Invalid Subject",
        message:
          "The subject you tried assigning to emails are invalid. Please try putting a valid email.",
        error: "error",
      };
    }

    req.names =
      req.names === undefined ? [] : req.names.length ? req.names : [];

    if ("error" === error) {
      return res.status(400).json(response);
    } else {
      let mailTransporter = await this.getTransporter(req.sender || "default");
      req.to.forEach((singleEmail, arrayIndex) => {
        const params = this.prepareMail(
          `${this.nameSender} <${this.mailSender}>` || `MSVProperties <${process.env.email_username_default}>`,
          singleEmail,
          req.subject,
          req.content ||
            `<p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">I work for Joe Oppen, an agent in United Real Estate located in New Jersey. I have a possible referral in your area.</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;"> </p>
          <p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Would you be interested?</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;"> </p>
          <p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Thank you. </p>
          <p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Tamara</p>
          `,
          req.names[arrayIndex]
        );
        mailTransporter.sendMail(params, this.handleEmailResponse);
      });
    }
  }
}

module.exports = Mailer;
