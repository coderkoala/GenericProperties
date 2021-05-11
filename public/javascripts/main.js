(function ($) {
  "use strict";
  var frontEndController = {
    init: function () {
      frontEndController.hideLoading();
      $("input").on("input change keyup", function (e) {
        frontEndController.validate(this);
      });
      $("input").on("blur", function (e) {
        frontEndController.sanitize(this);
      });
    },
    showLoading: function () {
      $("#loading").removeClass("hidden");
    },
    hideLoading: function () {
      $("#loading").addClass("hidden");
    },
    getAjaxRequestLead: function () {},
    validate: function (ele) {
      var $this = $(ele);
      $this.removeClass("is-invalid");
      var $type = $this.attr("validation");
      switch ($type) {
        case "location":
          if ($this.val().match(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\=|\+)+)/i)) {
            var newValue = $this.val().trim();
            $this.addClass("is-invalid");
            newValue.trim().replace(/\s{2,}/g, " ");
            $this.val(newValue).trigger("change");
          }
          break;
      }
    },
    sanitize: function (ele) {
      var $this = $(ele);
      var newValue = $this.val().trim();
      newValue.trim();
      newValue.replace(/\s{2,}/g, " ");
      newValue.replace(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\=|\+)+)/i, "");
      $this.val(newValue).trigger("change");
    },
  };

  window.frontEndController = frontEndController;

  // Boot up and remove loading.
  $(document).ready(function () {
    setTimeout(window.frontEndController.init, 500);
  });
})(jQuery.noConflict());
