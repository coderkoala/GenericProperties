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

  prepareMail( from, to, subject, recipient = '' ) {
    let email = new template();
    return {        
      from: from || process.env.email_username,
      to: to,
      subject: subject,
      html: email.getEmailBasic().replace('{name}', ` ${recipient}`),
    };
  }

  async sendMail(req, res) {
    let error = 'success';
    let response = {}; 
    if ( req.to.length < 1 ) {
      error = 'error';
      response = {
        title: 'Invalid Receiver',
        message: 'The receipient received invalid. Please try again with a valid receiver.',
        error: 'error'
      };
    } else if( req.subject.match(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i) ) {
      error = 'error';
      response = {
        title: 'Invalid Subject',
        message: 'The subject you tried assigning to emails are invalid. Please try putting a valid email.',
        error: 'error'
      };
    }

    req.names = req.names === undefined ? [] : req.names.length ? req.names : []; 

    if ( 'error' === error ) {
      res.status(400).json(response);
    } else {
      let mailTransporter = await this.getTransporter();
      req.to.forEach( ( singleEmail, arrayIndex ) => {
        const params = this.prepareMail( null, singleEmail, req.subject, req.names[arrayIndex] );
        mailTransporter.sendMail( params, this.handleEmailResponse);
      });
    }

  }
}

module.exports = Mailer;
