(function ($) {
  "use strict";
  var frontEndController = {
    queryGeolocationEndpoint : '/geolocation',
    init: function () {
      frontEndController.hideLoading();
      $("input").on("input change keyup", function (e) {
        frontEndController.validate(this);
      });
      $("input").on("blur", function (e) {
        frontEndController.sanitize(this);
      });
      $("#btnSubmit").on("click", function (e) {
        frontEndController.getAjaxRequestLead();
      });
    },
    showLoading: function () {
      $("#loading").removeClass("hidden");
    },
    hideLoading: function () {
      $("#loading").addClass("hidden");
    },
    getAjaxRequestLead: function () {
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify({ "location": $('#location').val() }),
        url: frontEndController.queryGeolocationEndpoint,
        success : function( res ) {
          console.log(res);
        },
        error : function(xhr) {
          console.log('error', xhr);
        },
      });
    },
    validate: function (ele) {
      var $this = $(ele);
      $this.removeClass("is-invalid");
      var $type = $this.attr("validation");
      switch ($type) {
        case "location":
          if ($this.val().match(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i)) {
            $this.addClass("is-invalid");
          }
          break;
      }
    },
    sanitize: function (ele) {
      var $this = $(ele);
      var newValue = $this.val();
      newValue = newValue.replace(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i, '');
      newValue = newValue.replace(/\s{2,}/g, ' ');
      newValue = newValue.trim();
      $this.val(newValue).change();
    },
  };

  window.frontEndController = frontEndController;

  // Boot up and remove loading.
  $(document).ready(function () {
    setTimeout(window.frontEndController.init, 500);
  });
})(jQuery.noConflict());
