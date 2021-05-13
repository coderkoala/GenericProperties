(function ($) {
  "use strict";
  var frontEndController = {
    queryGeolocationEndpoint: "/geolocation",
    tableTemplate:
      '<tr><th scope="row">{subject}</th><td>{new_fullname}</td><td>{new_latitude}</td><td>{new_longitude}</td><td><a href="#" id="renderMap">Show Nearby Agents</a></td></tr>',
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
    messageBox: function (title, message, type = "success") {
      Swal.fire({
        title: title,
        icon: type,
        html: message,
      });
    },
    renderMap: function () {},
    getAjaxRequestLead: function () {
      frontEndController.showLoading();
      $("#tableau").fadeOut("slow");
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify({ location: $("#location").val() }),
        url: frontEndController.queryGeolocationEndpoint,
        success: function (results) {
          console.log(results);
          var tableName = $("#tableContent");
          var tableInjectRow = frontEndController.tableTemplate;
          tableInjectRow = tableInjectRow.replace(
            "{subject}",
            '<a target="_blank" href="' + results.hotLink + '">' + results.subject + "</a>"
          );
          tableInjectRow = tableInjectRow.replace(
            "{new_latitude}",
            results.new_latitude
          );
          tableInjectRow = tableInjectRow.replace(
            "{new_longitude}",
            results.new_longitude
          );
          tableInjectRow = tableInjectRow.replace(
            "{new_fullname}",
            results.new_fullname
          );
          tableName.empty().append(tableInjectRow);
          $("#renderMap").off().on("click", frontEndController.renderMap);
          frontEndController.hideLoading();
          $("#tableau").removeClass("hidden");
          $("#tableau").fadeIn("slow");
        },
        error: function (xhr) {
          frontEndController.hideLoading();
          frontEndController.messageBox(
            "Failed Retrieving Leads",
            xhr.responseJSON.error,
            "error"
          );
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
    UUIDMatcher: function (str) {
      return str.match(
        /&id=\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
      );
    },
    sanitize: function (ele) {
      var $this = $(ele);
      var newValue = $this.val();
      newValue = newValue.replace(
        /(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i,
        ""
      );
      newValue = newValue.replace(/\s{2,}/g, " ");
      newValue = newValue.trim();

      if (frontEndController.UUIDMatcher(newValue)) {
        newValue = frontEndController.UUIDMatcher(newValue)[0].slice(4);
        $this.val(newValue).change();
      } else {
        $this.val(newValue).change();
      }
    },
  };

  window.frontEndController = frontEndController;

  // Boot up and remove loading.
  $(document).ready(function () {
    setTimeout(window.frontEndController.init, 500);
  });
})(jQuery.noConflict());
