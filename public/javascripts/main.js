(function ($) {
  "use strict";
  var frontEndController = {
    queryGeolocationEndpoint: "/geolocation",
    queryfetchAgentEndpoint:
      "/api/v1/geolocation?latitude={latitude}&longitude={longitude}&distance={distance}",
    tableTemplate:
      '<tr><th scope="row">{subject}</th><td>{new_fullname}</td><td>{new_latitude}</td><td>{new_longitude}</td></tr>',
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
    renderTableResults: function () {
      var results = frontEndController.results;
      var tableName = $("#tableContent");
      var tableInjectRow = frontEndController.tableTemplate;
      tableInjectRow = tableInjectRow.replace(
        "{subject}",
        '<a target="_blank" href="' +
          results.hotLink +
          '">' +
          results.subject +
          "</a>"
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
      frontEndController.hideLoading();
      $("#tableau").removeClass("hidden");
      $("#tableau").fadeIn("slow");
    },
    renderMap: function () {
      var element = document.getElementById("map");
      element.style = "height:600px;";
      var map = L.map(element);

      map.attributionControl.setPrefix(
        '&copy; 2021 <a href="http://nobeldahal.com.np" target="_blank">Nobel Dahal</a>'
      );
      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Target's GPS coordinates.
      var target = L.latLng(results.new_latitude, results.new_longitude);
      // var abc = L.latLng("47.51737", "19.14611");
      map.setView(target, 14);

      // Add marker.
      // L.marker(abc)
      //   .addTo(map)
      //   .bindPopup('Test', { closeOnClick: false, autoClose: false });
    },
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
          frontEndController.results = results;
          if (
            false === results.new_longitude ||
            false === results.new_latitude ||
            isNaN(results.new_latitude) ||
            isNaN(results.new_longitude) ||
            !isFinite(results.new_latitude) ||
            Math.abs(results.new_latitude) > 90 ||
            !isFinite(results.new_longitude) ||
            Math.abs(results.new_longitude) > 180
          ) {
            // Render div for error handling
          } else {
            frontEndController.renderTableResults();
            frontEndController.renderMap();
          }
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
