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

      // Lastly, fetch Lead UUID if residing within dynamics as an iframe.
      frontEndController.bootFieldLeadUUID();
    },
    bootFieldLeadUUID: function () {
      try {
        var leadAssociatedGUID = window.parent.Xrm.Page.data.entity
          .getId()
          .replace("{", "")
          .replace("}", "");
        $("#location").val(leadAssociatedGUID).change();
      } catch (e) {}
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
      // $("#tableau").removeClass("hidden"); For development.
      // $("#tableau").fadeIn("slow");
    },
    renderMap: function () {
      var element = document.getElementById("map");
      element.style = "height:600px;";
      frontEndController.map = L.map(element);

      frontEndController.map.attributionControl.setPrefix(
        '&copy; 2021 <a href="http://nobeldahal.com.np" target="_blank">Nobel Dahal</a>'
      );
      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(frontEndController.map);

      // Target's GPS coordinates.
      var target = L.latLng(
        frontEndController.results.new_latitude,
        frontEndController.results.new_longitude
      );
      var leadCenterLatLong = L.latLng(
        frontEndController.results.new_latitude,
        frontEndController.results.new_longitude
      );
      frontEndController.map.setView(target, 14);

      let subject =
        '<a target="_blank" href="' +
        frontEndController.results.hotLink +
        '">' +
        frontEndController.results.subject +
        "</a>";

      // Add marker.
      L.marker(leadCenterLatLong, {
        icon: frontEndController.getIconInstance(),
      })
        .addTo(frontEndController.map)
        .bindPopup(subject, {
          closeOnClick: false,
          autoClose: false,
        });

      // Don't let another iteration proceed.
      $("#btnSubmit").remove();
      $("#location").attr("disabled", "disabled").addClass("disabled");
    },
    getIconInstance: function (
      icon = "/stylesheets/images/home.png",
      dimensions = [25, 25]
    ) {
      var customIcon = L.Icon.extend({
        options: {
          iconSize: dimensions,
        },
      });

      return new customIcon({
        iconUrl: icon,
      });
    },
    fetchAgentCoordinatesPOST: function () {
      var endpoint = frontEndController.queryfetchAgentEndpoint;
      if (
        false === frontEndController.results.new_longitude ||
        false === frontEndController.results.new_latitude ||
        isNaN(frontEndController.results.new_latitude) ||
        isNaN(frontEndController.results.new_longitude) ||
        !isFinite(frontEndController.results.new_latitude) ||
        Math.abs(frontEndController.results.new_latitude) > 90 ||
        !isFinite(frontEndController.results.new_longitude) ||
        Math.abs(frontEndController.results.new_longitude) > 180
      ) {
        // Render div for error handling
        console.log("Handle exception for validation issue with no latLong!");
      } else {
        endpoint = endpoint
          .replace("{latitude}", frontEndController.results.new_latitude)
          .replace("{longitude}", frontEndController.results.new_longitude)
          .replace("{distance}", 5);
        frontEndController.showLoading();
        $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          datatype: "json",
          url: endpoint,
          success: function (results) {
            frontEndController.agentResults = results;
            frontEndController.hideLoading();
            var size = Object.keys(frontEndController.agentResults.data).length;
            if (size) {
              frontEndController.messageBox(
                "Agents Found",
                "Was able to compute " +
                  size +
                  " nearby points. Map will be updated shortly.",
                "success"
              );
              frontEndController.renderAgentResults();
            } else {
              frontEndController.messageBox(
                "No nearby Agents found",
                "The system was unable to find any nearby agents in the vicinity(5 KM) of the lead. Please broaden your choice and try again.",
                "error"
              );
            }
          },
          error: function (xhr) {
            frontEndController.hideLoading();
            frontEndController.messageBox(
              "Failed Computing Agents",
              "A network issue prevented from computing Agents locations around the lead. Please try again later.",
              "error"
            );
          },
        });
      }
    },
    renderAgentResults: function () {
      var fetchedAgents = frontEndController.agentResults;

      Object.keys(fetchedAgents.data).forEach(function (coordinateLatLong) {
        let singleAgentTuple = fetchedAgents.data[coordinateLatLong];
        let splitCoordinates = coordinateLatLong.split(",");

        // Initiate Marker
        var leadCenterLatLong = L.latLng(
          splitCoordinates[0], // Latitude.
          splitCoordinates[1] // Longitude.
        );

        // Override icon from class instantiation.
        L.marker(leadCenterLatLong, {
          icon: frontEndController.getIconInstance(
            "/stylesheets/images/user.png",
            [18, 25]
          ),
        })
          .addTo(frontEndController.map)
          .bindPopup(fetchedAgents.template.replace("{0}", singleAgentTuple), {
            closeOnClick: false,
            autoClose: false,
          });
      });
    },
    getAjaxRequestLead: function () {
      frontEndController.showLoading();
      $("#tableau").fadeOut("slow");
      $("input").change();
      if ($(".is-invalid").length) {
        frontEndController.messageBox(
          "Error",
          "Invalid Lead UUID detected, computation can not occur without valid Lead UUID.",
          "error"
        );
        frontEndController.hideLoading();
        return;
      }
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
            console.log("Handle exception map being unrenderable!");
          } else {
            frontEndController.renderTableResults();
            frontEndController.renderMap();
            frontEndController.fetchAgentCoordinatesPOST();
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
