"use strict";
require("dotenv").config();
let nodemailer = require("nodemailer");
let logger = require('./logger');

class Mailer {
  handleEmailResponse( errorResponse, response ) {
    if(errorResponse) {
      logger.error(errorResponse);      
      return false;
    } else {
      logger.info(errorResponse);      
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
    return {
      from: param.from || process.env.email_username,
      to: param.to,
      subject: param.subject,
      html: param.html,
    };
  }

  async sendMail(params, res) {
    this.res = res;
    let mailTransporter = await this.getTransporter();
    mailTransporter.sendMail(this.prepareMail(params), this.handleEmailResponse);
  }
}

module.exports = Mailer;
