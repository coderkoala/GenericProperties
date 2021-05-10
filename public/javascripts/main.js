"use strict";

(function ($) {
  "use strict";
  var frontEndController = {
    init: function () {
      frontEndController.hideLoading();
    },
    showLoading: function () {
      $("#loading").removeClass("hidden");
    },
    hideLoading: function () {
      $("#loading").addClass("hidden");
    },
  };

  window.frontEndController = frontEndController;

  // Boot up and remove loading.
  $( document ).ready(function() {
    setTimeout(window.frontEndController.init, 500);
  });
})(jQuery.noConflict());
