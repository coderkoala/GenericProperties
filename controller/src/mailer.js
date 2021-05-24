"use strict";
require("dotenv").config();
let nodemailer = require("nodemailer");
let logger = require('./logger');
let template = require('./emailTemplateHelper');

class Mailer {
  handleEmailResponse( errorResponse, response ) {
    if(errorResponse) {
      logger.error(errorResponse);      
      return false;
    } else {
      logger.info('[Success] Email dispatched successfully.');      
      return response;
    }
  }

  async getTransporter() {
    return nodemailer.createTransport({
      port: process.env.email_port || 587,
      host: process.env.email_host || "smtp.office365.com",
      auth: {
        user: process.env.email_username,
        pass: process.env.email_password,
      },
    });
  }

  prepareMail(param) {
    let email = new template();
    return {
      from: param.from || process.env.email_username,
      to: param.to.pop(),
      bcc: param.to,
      subject: param.subject,
      html: email.getEmailBasic(),
    };
  }

  async sendMail(req, res) {
    let mailTransporter = await this.getTransporter();
    mailTransporter.sendMail(this.prepareMail(req), this.handleEmailResponse);

  }
}

module.exports = Mailer;
