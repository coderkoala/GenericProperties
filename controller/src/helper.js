'use strict';

const helperMethods =  {
  getDate : ()=>{
    let date = new Date();
    return date.toISOString().split('T')[0];
  },
};

module.exports = helperMethods;
