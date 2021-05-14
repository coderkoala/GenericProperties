'use strict';

class termsController {

  async view( req, res, next ) {
    res.render('welcome', { title: 'Welcome' });
  }
}


module.exports = new termsController();
