(function ($, libMap) {
  "use strict";
  var this_ = {
    currentPageRouteEndpoint: "/geolocation",
    defaultDistanceToRenderNearbyAgents: 5,
    fetchRemoteAgentsAPIEndpoint:
      "/api/v1/geolocation?latitude={latitude}&longitude={longitude}&distance={distance}&leadid={leadid}",
    fetchSingleAgentDataAPIEndpoint:
      "/api/v1/agent?dynamics_id={id}",
    fetchForwardGeocodedValuesEndpoint:
      "https://api.positionstack.com/v1/forward?callback=callback&access_key={access_key}&query={query}&limit=1",
    mapPinTableContentForAgents:
      '<tr><th scope="row">{subject}</th><td>{new_fullname}</td><td>{new_latitude}</td><td>{new_longitude}</td></tr>',
    initDOM: function () {
      this_.hideLoadingScreenComponent();
      $("input").on("input change keyup", function (e) {
        this_.validateInputBoxValue(this);
      });
      $("input").on("blur", function (e) {
        this_.sanitizeInputBoxValue(this);
      });
      $("#btnSubmit").on("click", function (e) {
        this_.fetchLeadDatafromDynamics();
      });

      // Boot up the modals.
      this_.initCurrentModalsInDOM();

      // Lastly, fetch Lead UUID if residing within dynamics as an iframe.
      this_.fetchDynamicsLeadUUIDfromParentIFrame();
    },
    initCurrentModalsInDOM: function () {
      // Trigger for opening agents modal.
      $("#triggerModalAgents").click(function () {
        $("#modalAgents").modal("show");

        $(".modal-dialog").draggable({
          handle: ".modal-content",
          containment: "window",
        });
      });

      // Trigger close for modal.
      $(".dismissModal").on("click", function (e) {
        this_.closeCurrentlyOpenedModal(this);
      });
    },
    closeCurrentlyOpenedModal(e) {
      $(e).parents().find(".modal").modal("hide");
    },
    showLoadingScreenComponent: function () {
      $("#loading").removeClass("hidden");
    },
    hideLoadingScreenComponent: function () {
      $("#loading").addClass("hidden");
    },
    renderTableforMapPinContent: function () {
      var arrayAgentsDataStored = this_.arrayAgentsDataStored;
      var tableElement = $("#tableContent");
      var dataToBeInjectedToTableRow = this_.mapPinTableContentForAgents;
      dataToBeInjectedToTableRow = dataToBeInjectedToTableRow.replace(
        "{subject}",
        '<a target="_blank" href="' +
          arrayAgentsDataStored.hotLink +
          '">' +
          arrayAgentsDataStored.subject +
          "</a>"
      );
      dataToBeInjectedToTableRow = dataToBeInjectedToTableRow.replace(
        "{new_latitude}",
        arrayAgentsDataStored.new_latitude
      );
      dataToBeInjectedToTableRow = dataToBeInjectedToTableRow.replace(
        "{new_longitude}",
        arrayAgentsDataStored.new_longitude
      );
      dataToBeInjectedToTableRow = dataToBeInjectedToTableRow.replace(
        "{new_fullname}",
        arrayAgentsDataStored.new_fullname
      );
      tableElement.empty().append(dataToBeInjectedToTableRow);
      this_.hideLoadingScreenComponent();
      // $("#tableau").removeClass("hidden"); For development.
      // $("#tableau").fadeIn("slow");
    },
    renderMessageBoxSWAL: function (title, message, type = "success") {
      Swal.fire({
        title: title,
        icon: type,
        html: message,
      });
    },
    renderMapToDOM: function () {
      var mapElement = document.getElementById("map");
      mapElement.style = "height:600px;";
      this_.globalMapSelectorElement = libMap.map(mapElement);

      this_.globalMapSelectorElement.attributionControl.setPrefix(
        '&copy; 2021 <a href="http://nobeldahal.com.np" target="_blank">Nobel Dahal</a>'
      );
      libMap.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this_.globalMapSelectorElement);

      // Target's GPS coordinates.
      var mapPinForIndividualAgent = libMap.latLng(
        this_.arrayAgentsDataStored.new_latitude,
        this_.arrayAgentsDataStored.new_longitude
      );
      var leadsPositionInMap = libMap.latLng(
        this_.arrayAgentsDataStored.new_latitude,
        this_.arrayAgentsDataStored.new_longitude
      );
      this_.globalMapSelectorElement.setView(mapPinForIndividualAgent, 14);

      var subject =
        '<a target="_blank" href="' +
        this_.arrayAgentsDataStored.hotLink +
        '">' +
        this_.arrayAgentsDataStored.subject +
        "</a>";

      // Add marker.
      libMap.marker(leadsPositionInMap, {
        icon: this_.renderCustomMapPinsGenerator(),
      })
        .addTo(this_.globalMapSelectorElement)
        .bindPopup(subject, {
          closeOnClick: false,
          autoClose: false,
        });

      // Don't let another iteration proceed.
      $("#btnSubmit").remove();
      $("#triggerModalAgents").removeClass("hidden");
      $("#location").attr("disabled", "disabled").addClass("disabled");
    },
    renderCustomMapPinsGenerator: function (
      icon = "/stylesheets/images/home.png",
      dimensions = [25, 25]
    ) {
      var customIcon = libMap.Icon.extend({
        options: {
          iconSize: dimensions,
        },
      });

      return new customIcon({
        iconUrl: icon,
      });
    },
    renderMapPinsforAgentsFromRemoteResult: function () {
      var localAgentDataStored = this_.agentarrayAgentsDataStored;

      Object.keys(localAgentDataStored.data).forEach(function (stringCoordinatesLatitudeLongitude) {
        var singleAgentTuple = localAgentDataStored.data[stringCoordinatesLatitudeLongitude];
        var arrayCoordinatesLatitudeLongitude = stringCoordinatesLatitudeLongitude.split(",");

        // Initiate Marker
        var agentsPositionInMap = libMap.latLng(
          arrayCoordinatesLatitudeLongitude[0],
          arrayCoordinatesLatitudeLongitude[1]
        );

        // Override icon from class instantiation.
        libMap.marker(agentsPositionInMap, {
          icon: this_.renderCustomMapPinsGenerator(
            "/stylesheets/images/user.png",
            [18, 25]
          ),
        })
          .addTo(this_.globalMapSelectorElement)
          .bindPopup(localAgentDataStored.template.replace("{0}", singleAgentTuple), {
            closeOnClick: false,
            autoClose: false,
          });
      });
    },
    renderMapBeforeFetchingForwardGeocodedCoordinates: function () {
      var firstElementinArrayGeocodedData = this_.arrayForwardGeocodedDataStored.data.pop();
      this_.arrayAgentsDataStored.new_latitude = firstElementinArrayGeocodedData.latitude;
      this_.arrayAgentsDataStored.new_longitude = firstElementinArrayGeocodedData.longitude;

      // Initiate recovery.
      this_.renderTableforMapPinContent();
      this_.renderMapToDOM();
      this_.fetchNearbyAgentsDatafromBackend();
    },
    fetchDynamicsLeadUUIDfromParentIFrame: function () {
      var flagSkipHidingUIComponents = true;
      try {
        var leadUUIDfromParentIFrame = window.location.search
          .replace("?id=", "")
          .split("&")[0];
        $("#location").val(leadUUIDfromParentIFrame).change();
      } catch (e) {
        flagSkipHidingUIComponents = true;
      }

      if (!flagSkipHidingUIComponents) {
        $("nav").hide(); // For reducing noise.
        $("footer").hide(); // For reducing noise.
      }
    },
    fetchNearbyAgentsDatafromBackend: function () {
      var endpointLocalRemoteAgents = this_.fetchRemoteAgentsAPIEndpoint;
      if (
        null === this_.arrayAgentsDataStored.new_longitude ||
        null === this_.arrayAgentsDataStored.new_latitude ||
        isNaN(this_.arrayAgentsDataStored.new_latitude) ||
        isNaN(this_.arrayAgentsDataStored.new_longitude) ||
        !isFinite(this_.arrayAgentsDataStored.new_latitude) ||
        Math.abs(this_.arrayAgentsDataStored.new_latitude) > 90 ||
        !isFinite(this_.arrayAgentsDataStored.new_longitude) ||
        Math.abs(this_.arrayAgentsDataStored.new_longitude) > 180
      ) {
        // Render div for error handling
        this_.renderMessageBoxSWAL(
          "Agents Found",
          "Exception occured during validation: Issue with no valid latitude and longitude coordinates.",
          "error"
        );
      } else {
        endpointLocalRemoteAgents = endpointLocalRemoteAgents
          .replace("{latitude}", this_.arrayAgentsDataStored.new_latitude)
          .replace("{longitude}", this_.arrayAgentsDataStored.new_longitude)
          .replace("{distance}", this_.defaultDistanceToRenderNearbyAgents || 5)
          .replace("{leadid}", this_.arrayAgentsDataStored.leadid);
        this_.showLoadingScreenComponent();
        $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          datatype: "json",
          url: endpointLocalRemoteAgents,
          success: function (arrayAgentsDataStored) {
            this_.agentarrayAgentsDataStored = arrayAgentsDataStored;
            this_.hideLoadingScreenComponent();
            var size = Object.keys(this_.agentarrayAgentsDataStored.data).length;
            if (size) {
              this_.renderMessageBoxSWAL(
                "Agents Found",
                "Was able to compute " +
                  size +
                  " nearby points. Map will be updated shortly.",
                "success"
              );
              this_.renderMapPinsforAgentsFromRemoteResult();
            } else {
              this_.renderMessageBoxSWAL(
                "No nearby Agents found",
                "The system was unable to find any nearby agents in the vicinity(5 KM) of the lead. Please broaden your choice and try again.",
                "error"
              );
            }
          },
          error: function () {
            this_.hideLoadingScreenComponent();
            this_.renderMessageBoxSWAL(
              "Failed Computing Agents",
              "A network issue prevented from computing Agents locations around the lead. Please try again later.",
              "error"
            );
          },
        });
      }
    },
    fetchForwardGeocodedCoordinatesFromStreetAddress: function () {
      var apiKeyGeolocationService = $("main").data("key");
      if (
        null === this_.arrayAgentsDataStored.new_street ||
        !this_.arrayAgentsDataStored.new_street
      ) {
        this_.renderMessageBoxSWAL(
          "Error",
          "Geolocation services can not be accessed, the lead doesn't have a valid street address.",
          "error"
        );
        this_.hideLoadingScreenComponent();
      } else {
        $.getJSON(
          this_.fetchForwardGeocodedValuesEndpoint
            .replace("{access_key}", apiKeyGeolocationService)
            .replace("{query}", this_.arrayAgentsDataStored.new_street),
          {}
        )
          .done(function (json) {
            this_.arrayForwardGeocodedDataStored = json;
            this_.renderMapBeforeFetchingForwardGeocodedCoordinates();
          })
          .fail(function () {
            this_.renderMessageBoxSWAL(
              "Service Down",
              "The geolocation service is currently down, please try again later.",
              "error"
            );
            this_.hideLoadingScreenComponent();
          });
      }
    },
    fetchLeadDatafromDynamics: function () {
      this_.showLoadingScreenComponent();
      $("#tableau").fadeOut("slow");
      $("input").change();
      if ($(".is-invalid").length) {
        this_.renderMessageBoxSWAL(
          "Error",
          "Invalid Lead UUID detected, computation can not occur without valid Lead UUID.",
          "error"
        );
        this_.hideLoadingScreenComponent();
        return;
      }
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify({ location: $("#location").val() }),
        url: this_.currentPageRouteEndpoint,
        success: function (arrayAgentsDataStored) {
          this_.arrayAgentsDataStored = arrayAgentsDataStored;
          if (
            null === arrayAgentsDataStored.new_longitude ||
            null === arrayAgentsDataStored.latitude ||
            false === arrayAgentsDataStored.new_longitude ||
            false === arrayAgentsDataStored.new_latitude ||
            isNaN(arrayAgentsDataStored.new_latitude) ||
            isNaN(arrayAgentsDataStored.new_longitude) ||
            !isFinite(arrayAgentsDataStored.new_latitude) ||
            Math.abs(arrayAgentsDataStored.new_latitude) > 90 ||
            !isFinite(arrayAgentsDataStored.new_longitude) ||
            Math.abs(arrayAgentsDataStored.new_longitude) > 180
          ) {
            this_.renderMessageBoxSWAL(
              "Invalid coordinates detected",
              "The script detected invalid coordinates, will now attempt to geocode the data. ",
              "warning"
            );
            this_.fetchForwardGeocodedCoordinatesFromStreetAddress();
          } else {
            this_.renderTableforMapPinContent();
            this_.renderMapToDOM();
            this_.fetchNearbyAgentsDatafromBackend();
          }
        },
        error: function (xhr) {
          this_.hideLoadingScreenComponent();
          this_.renderMessageBoxSWAL(
            "Failed Retrieving Leads",
            xhr.responseJSON.error,
            "error"
          );
        },
      });
    },
    validateInputBoxValue: function (ele) {
      var $selectedElement = $(ele);
      $selectedElement.removeClass("is-invalid");
      var $type = $selectedElement.attr("validation");
      switch ($type) {
        case "location":
          if ($selectedElement.val().match(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i)) {
            $selectedElement.addClass("is-invalid");
          }
          break;
      }
    },
    sanitizeInputBoxValue: function (ele) {
      var $selectedElementToSanitize = $(ele);
      var sanitizedValue = $selectedElementToSanitize.val();
      sanitizedValue = sanitizedValue.replace(
        /(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i,
        ""
      );
      sanitizedValue = sanitizedValue.replace(/\s{2,}/g, " ");
      sanitizedValue = sanitizedValue.trim();

      if (this_.matchRegexUUID(sanitizedValue)) {
        sanitizedValue = this_.matchRegexUUID(sanitizedValue)[0].slice(4);
        $selectedElementToSanitize.val(sanitizedValue).change();
      } else {
        $selectedElementToSanitize.val(sanitizedValue).change();
      }
    },
    matchRegexUUID: function (str) {
      return str.match(
        /&id=\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
      );
    },
  };

  window.this_ = this_;

  // Boot up and remove loading.
  $(document).ready(function () {
    switch (document.location.pathname) {
      case "/geolocation":
        setTimeout(window.this_.initDOM, 500);
        break;

      default:
        setTimeout(window.this_.hideLoadingScreenComponent, 500);
        console.log("[Load finished] No scripts loaded");
    }
  });
})(jQuery.noConflict(), L);
