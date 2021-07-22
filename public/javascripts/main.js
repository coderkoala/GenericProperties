(function ($, libMap) {
  "use strict";
  var glMSV = {
    subject: "Lead Referral Near You",
    emailAgentsAPIEndpoint: "/api/v1/email",
    currentPageRouteEndpoint: "/geolocation",
    defaultDistanceToRenderNearbyAgents: 5,
    emailBodyContent:
      '<p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">I work for Joe Oppen, an agent in United Real Estate located in New Jersey. I have a possible referral in your area.</p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;"> </p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Would you be interested?</p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;"> </p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Thank you. </p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">MSVProperties Representative</p>',
    emailingUsersList: {
      default1: "Refer to Broker & Buyer Agents",
      default2: "MSV Group",
      admin: "MSVProperties Admin",
      carlota: "Carlota Panao",
      sara: "Sara Assaf",
      tamara: "Tamara Karic",
    },
    emailTemplates: {
      0: {
        name: "R2B Email Template",
        content:
          '<p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">My name is _____, I work for an agent out of New Jersey that is licensed with United real Estate. We help match home-owners with the top agents in their area. We have a potential listing referral that you might be keenly interested in.</p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">&nbsp;</p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Please let me know if you are interested on working together to build a successful network.</p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">&nbsp;</p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Thank you! </p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">_____</p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Phone (call or text): (xxx) xxx-xxxx <br></p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Email: _______@msvproperties.net<br></p>',
      },
      1: {
        name: "Buyer Agent Email Template",
        content:
          '<p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Good Afternoon, my name is _____, I work for a private investor in New Jersey. We are searching someone to represent us in the purchase of a property in your area, it looks like we could get it for a good deal. <br></p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;"><br></p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">We work primarily with foreclosures and probates, and this is one of them. We already tried reaching out to the owner, but we were not successful - but if you are local and you are able to knock on their door, you could probably help us get this deal. <br></p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;"><br></p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">The price we offered on the contract is $__________, I am willing to pay a 2% commission of the purchase price to a buyer\'s agent if you can help facilitate this purchase (this is not a listing).</p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;"><br></p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">I am looking forward to working together, please let me know if you are interested, and you can just reply to this email to confirm so we can proceed. Alternatively, we can sign a Buyer\'s Agent Agreement.</p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;"><br></p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">I have provided my contact information below, thank you for your time and consideration.</p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">&nbsp;_____</p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Phone (call or text): (xxx) xxx-xxxx <br></p><p style="margin: 0; font-size: 14px; line-height: 1.8; word-break: break-word; text-align: justify; mso-line-height-alt: 25px; margin-top: 0; margin-bottom: 0;">Email: _______@msvproperties.net<br></p>',
      },
    },
    fetchRemoteAgentsAPIEndpoint:
      "/api/v1/geolocation?latitude={latitude}&longitude={longitude}&distance={distance}&leadid={leadid}",
    fetchRemoteAgentsCollectionsCachedAPIEndpoint: "/api/v1/agents?id={leadid}",
    fetchSingleAgentDataAPIEndpoint: "/api/v1/agent?id={id}",
    fetchForwardGeocodedValuesEndpoint:
      "https://api.positionstack.com/v1/forward?callback=callback&access_key={access_key}&query={query}&limit=1",
    mapPinTableContentForAgents:
      '<tr><th scope="row">{subject}</th><td>{new_fullname}</td><td>{new_latitude}</td><td>{new_longitude}</td></tr>',
    initDOM: function () {
      glMSV.hideLoadingScreenComponent();
      $("input").on("input change keyup", function (e) {
        glMSV.validateInputBoxValue(this);
      });
      $("input.sanitize").on("blur", function (e) {
        glMSV.sanitizeInputBoxValue(this);
      });
      $("#btnSubmit").on("click", function (e) {
        glMSV.fetchLeadDatafromDynamics();
      });

      // Boot up the modals.
      glMSV.initCurrentModalsInDOM();

      // Boot up the email editor.
      glMSV.initWYSIWYGEditor();

      // Lastly, fetch Lead UUID if residing within dynamics as an iframe.
      glMSV.fetchDynamicsLeadUUIDfromParentIFrame();
    },
    initCurrentModalsInDOM: function () {
      // Trigger for opening agents modal.
      $("#triggerModalAgents").click(function () {
        if (glMSV.arrayAgentsCachedCollectionData) {
          $("#modalAgents").modal("show");
        } else {
          glMSV.fetchCachedAgentsCollectionFromRemote();
        }
      });

      // Trigger for opening subject changer for email.
      $("#subject").val(glMSV.subject).change();
      $("#changeEmailSubject").click(function () {
        $("#subject").val(glMSV.subject).change();
        $("#changeSubject").modal("show");
      });

      // Trigger send dummy email modal.
      $("#testEmail")
        .off()
        .on("click", function (e) {
          $("#testEmailModal").modal("show");
        });

      $("#sendTestEmail")
        .off()
        .on("click", function (e) {
          $("#testEmailAddress").change();
          $("#testEmailName").change();

          if (
            $("#testEmailAddress").hasClass("is-invalid") ||
            $("#testEmailName").hasClass("is-invalid")
          ) {
            glMSV.renderMessageBoxSWAL(
              "Email Parameters Invalid",
              "The email address or the name supplied was found to be invalid, please try again with valid information",
              "error"
            );
          } else {
            $("#testEmailModal").modal("hide");
            glMSV.sendEmail(
              [$("#testEmailAddress").val() || null],
              [$("#testEmailName").val() || "Test Email Sender"]
            );
          }
        });

      // Save to email subject.
      $("#saveSubject").click(function () {
        if (!$("#subject").hasClass("is-invalid")) {
          glMSV.subject = $("#subject").val();

          if (!glMSV.emailBodyContent.match(/^.+\s.+$/)) {
            glMSV.renderMessageBoxSWAL(
              "Email Empty",
              "The content of your email is empty. Please fill in valid email content to proceed.",
              "error"
            );
            return;
          } else if (glMSV.emailBodyContent.match(/\_/g)) {
            // Preventing a template spilling to consumers.
            glMSV.renderMessageBoxSWAL(
              "Details not filled",
              "The content of your email still has template remnants. Please replace any underscores with personal details.",
              "error"
            );
            return;
          } else {
            glMSV.emailContentsUpsert = glMSV.emailBodyContent;
            $("#changeSubject").modal("hide");
          }
        } else {
          glMSV.renderMessageBoxSWAL(
            "Invalid Email Subject",
            "An email subject must be a well-formed sentence.",
            "error"
          );
        }
      });

      // Make the agents list table draggable.
      $(".draggable-ui").draggable({
        handle: ".modal-content",
        containment: "window",
      });

      // Trigger close for modal.
      $(".dismissModal").on("click", function (e) {
        glMSV.closeCurrentlyOpenedModal(this);
      });

      // Append Sender's List.
      Object.keys(glMSV.emailingUsersList).forEach(function (tuple) {
        var user = glMSV.emailingUsersList[tuple];
        var option = tuple;
        $("#sender").append(
          '<option value="' + option + '">' + user + "</option>"
        );
      });

      // Populate templates.
      Object.keys(glMSV.emailTemplates).forEach(function (tuple) {
        var templateElement = glMSV.emailTemplates[tuple];
        var templateName = templateElement.name;

        $("#template").append(
          '<option value="' + tuple + '">' + templateName + "</option>"
        );
      });

      $("#template").change(function (e) {
        var $this = $(e.currentTarget).val();

        try {
          var emailContent = glMSV.emailTemplates[$this].content;
          $(".pell-content").html(emailContent);
        } catch (e) {}
      });
    },
    initWYSIWYGEditor: function (e) {
      const editor = pell.init({
        element: document.getElementById("editor"),
        onChange: (html) => {
          window.glMSV.emailBodyContent = html;
        },
        defaultParagraphSeparator: "p",
        styleWithCSS: true,
        actions: [
          "bold",
          "italic",
          "heading1",
          "paragraph",
          "strikethrough",
          "olist",
          "ulist",
          "link",
          "line",
          "underline",
        ],
      });
      editor.content.innerHTML = window.glMSV.emailBodyContent;
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
    renderCurrentlySelectedAgentAsModal: function (e) {
      var $this = $(this);

      var id = $this.parents().closest("tr").data("id");

      glMSV.showLoadingScreenComponent();
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: glMSV.fetchSingleAgentDataAPIEndpoint.replace("{id}", id),
        success: function (dataFetchedFromRemoteServer) {
          glMSV.renderPopOverSWALHTML(
            dataFetchedFromRemoteServer.title,
            dataFetchedFromRemoteServer.data,
            null,
            null,
            "70%"
          );

          glMSV.hideLoadingScreenComponent();
        },
        error: function (data) {
          glMSV.hideLoadingScreenComponent();
          glMSV.renderPopOverSWALHTML(
            data.title || "Error",
            data.message ||
              "The agent record couldn't be found in your Dynamics 365 Database.",
            data.icon || "error"
          );
        },
      });
    },
    renderTableforMapPinContent: function () {
      var arrayLeadDataStored = glMSV.arrayLeadDataStored;
      var tableElement = $("#tableContent");
      var dataToBeInjectedToTableRow = glMSV.mapPinTableContentForAgents;
      dataToBeInjectedToTableRow = dataToBeInjectedToTableRow.replace(
        "{subject}",
        '<a target="_blank" href="' +
          arrayLeadDataStored.hotLink +
          '">' +
          arrayLeadDataStored.subject +
          "</a>"
      );
      dataToBeInjectedToTableRow = dataToBeInjectedToTableRow.replace(
        "{new_latitude}",
        arrayLeadDataStored.new_latitude
      );
      dataToBeInjectedToTableRow = dataToBeInjectedToTableRow.replace(
        "{new_longitude}",
        arrayLeadDataStored.new_longitude
      );
      dataToBeInjectedToTableRow = dataToBeInjectedToTableRow.replace(
        "{new_fullname}",
        arrayLeadDataStored.new_fullname
      );
      tableElement.empty().append(dataToBeInjectedToTableRow);
      glMSV.hideLoadingScreenComponent();
      // $("#tableau").removeClass("hidden"); For development.
      // $("#tableau").fadeIn("slow");
    },
    renderMessageBoxSWAL: function (
      title,
      message,
      type = "success",
      callback = null
    ) {
      try {
        Swal.fire({
          title: title,
          icon: type,
          html: message,
        }).then(callback);
      } catch (e) {}
    },
    renderPopOverSWALHTML: function (
      title,
      message,
      type = null,
      callback = null,
      width = null
    ) {
      try {
        Swal.fire({
          title: title,
          html: message,
          icon: type,
          width: width,
          showCloseButton: true,
          showConfirmButton: false,
        }).then(callback);
      } catch (e) {}
    },
    renderMapToDOM: function () {
      var mapElement = document.getElementById("map");
      mapElement.style = "height:600px;";
      glMSV.globalMapSelectorElement = libMap.map(mapElement);

      glMSV.globalMapSelectorElement.attributionControl.setPrefix(
        '&copy; 2021 <a href="https://nobeldahal.com.np" target="_blank">Nobel Dahal</a>'
      );
      libMap
        .tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(glMSV.globalMapSelectorElement);

      // Target's GPS coordinates.
      var mapPinForIndividualAgent = libMap.latLng(
        glMSV.arrayLeadDataStored.new_latitude,
        glMSV.arrayLeadDataStored.new_longitude
      );
      var leadsPositionInMap = libMap.latLng(
        glMSV.arrayLeadDataStored.new_latitude,
        glMSV.arrayLeadDataStored.new_longitude
      );
      glMSV.globalMapSelectorElement.setView(mapPinForIndividualAgent, 14);

      var subject =
        '<a target="_blank" href="' +
        glMSV.arrayLeadDataStored.hotLink +
        '">' +
        glMSV.arrayLeadDataStored.subject +
        "</a>";

      // Add marker.
      libMap
        .marker(leadsPositionInMap, {
          icon: glMSV.renderCustomMapPinsGenerator(),
        })
        .addTo(glMSV.globalMapSelectorElement)
        .bindPopup(subject, {
          closeOnClick: false,
          autoClose: false,
        });

      // Don't let another iteration proceed.
      $("#btnSubmit").remove();
      $(".post-flight").removeClass("hidden");
      // $("#changeEmailSubject").removeClass("hidden");
      // $("#triggerModalAgents").removeClass("hidden");
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
      var localAgentDataStored = glMSV.agentarrayAgentsDataStored;

      Object.keys(localAgentDataStored.data).forEach(function (
        stringCoordinatesLatitudeLongitude
      ) {
        var singleAgentTuple =
          localAgentDataStored.data[stringCoordinatesLatitudeLongitude];
        var arrayCoordinatesLatitudeLongitude =
          stringCoordinatesLatitudeLongitude.split(",");

        // Initiate Marker
        var agentsPositionInMap = libMap.latLng(
          arrayCoordinatesLatitudeLongitude[0],
          arrayCoordinatesLatitudeLongitude[1]
        );

        // Override icon from class instantiation.
        libMap
          .marker(agentsPositionInMap, {
            icon: glMSV.renderCustomMapPinsGenerator(
              "/stylesheets/images/user.png",
              [18, 25]
            ),
          })
          .addTo(glMSV.globalMapSelectorElement)
          .bindPopup(
            localAgentDataStored.template.replace("{0}", singleAgentTuple),
            {
              closeOnClick: false,
              autoClose: false,
            }
          );
      });
    },
    renderMapBeforeFetchingForwardGeocodedCoordinates: function () {
      var firstElementinArrayGeocodedData =
        glMSV.arrayForwardGeocodedDataStored.data.pop();
      glMSV.arrayLeadDataStored.new_latitude =
        firstElementinArrayGeocodedData.latitude;
      glMSV.arrayLeadDataStored.new_longitude =
        firstElementinArrayGeocodedData.longitude;

      // Initiate recovery.
      glMSV.renderTableforMapPinContent();
      glMSV.renderMapToDOM();
      glMSV.fetchNearbyAgentsDatafromBackend();
    },
    fetchCachedAgentsCollectionFromRemote: function () {
      glMSV.showLoadingScreenComponent();
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: glMSV.fetchRemoteAgentsCollectionsCachedAPIEndpoint.replace(
          "{leadid}",
          glMSV.arrayLeadDataStored.leadid
        ),
        success: function (arrayAgentsCachedCollectionData) {
          glMSV.arrayAgentsCachedCollectionData =
            arrayAgentsCachedCollectionData;
          glMSV.manageAllCachedAgentsEvents();
          $("#modalAgents").modal("show");
          glMSV.hideLoadingScreenComponent();
        },
        error: function (data) {
          glMSV.hideLoadingScreenComponent();
          glMSV.renderMessageBoxSWAL(
            data.title || "Session has expired",
            data.message ||
              "Computed data no longer available, please refresh the window and try again.",
            data.icon || "error"
          );
        },
      });
    },
    fetchDynamicsLeadUUIDfromParentIFrame: function () {
      var flagSkipHidingUIComponents = false;
      try {
        var leadUUIDfromParentIFrame = window.location.search
          .replace("?id=", "")
          .split("&")[0];
        $("#location").val(leadUUIDfromParentIFrame).change();
        if ("" !== leadUUIDfromParentIFrame) {
          flagSkipHidingUIComponents = true;
        }
      } catch (e) {}

      if (flagSkipHidingUIComponents) {
        $(".navbar").hide(); // For reducing noise.
        $(".footer").hide(); // For reducing noise.
      }
    },
    fetchNearbyAgentsDatafromBackend: function () {
      var endpointLocalRemoteAgents = glMSV.fetchRemoteAgentsAPIEndpoint;
      if (
        null === glMSV.arrayLeadDataStored.new_longitude ||
        null === glMSV.arrayLeadDataStored.new_latitude ||
        isNaN(glMSV.arrayLeadDataStored.new_latitude) ||
        isNaN(glMSV.arrayLeadDataStored.new_longitude) ||
        !isFinite(glMSV.arrayLeadDataStored.new_latitude) ||
        Math.abs(glMSV.arrayLeadDataStored.new_latitude) > 90 ||
        !isFinite(glMSV.arrayLeadDataStored.new_longitude) ||
        Math.abs(glMSV.arrayLeadDataStored.new_longitude) > 180
      ) {
        // Render div for error handling
        glMSV.renderMessageBoxSWAL(
          "Agents Found",
          "Exception occured during validation: Issue with no valid latitude and longitude coordinates.",
          "error"
        );
      } else {
        endpointLocalRemoteAgents = endpointLocalRemoteAgents
          .replace("{latitude}", glMSV.arrayLeadDataStored.new_latitude)
          .replace("{longitude}", glMSV.arrayLeadDataStored.new_longitude)
          .replace("{distance}", glMSV.defaultDistanceToRenderNearbyAgents || 5)
          .replace("{leadid}", glMSV.arrayLeadDataStored.leadid);
        glMSV.showLoadingScreenComponent();
        $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          datatype: "json",
          url: endpointLocalRemoteAgents,
          success: function (arrayLeadDataStored) {
            glMSV.agentarrayAgentsDataStored = arrayLeadDataStored;
            glMSV.hideLoadingScreenComponent();
            var size = Object.keys(
              glMSV.agentarrayAgentsDataStored.data
            ).length;
            if (size) {
              glMSV.renderMessageBoxSWAL(
                "Agents Found",
                "Was able to compute " +
                  size +
                  " nearby points. Map will be updated shortly.",
                "success"
              );
              glMSV.renderMapPinsforAgentsFromRemoteResult();
            } else {
              glMSV.renderMessageBoxSWAL(
                "No nearby Agents found",
                "The system was unable to find any nearby agents in the vicinity(5 KM) of the lead. Please broaden your choice and try again.",
                "error"
              );
            }
          },
          error: function () {
            glMSV.hideLoadingScreenComponent();
            glMSV.renderMessageBoxSWAL(
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
        null === glMSV.arrayLeadDataStored.new_street ||
        !glMSV.arrayLeadDataStored.new_street
      ) {
        glMSV.renderMessageBoxSWAL(
          "Error",
          "Geolocation services can not be accessed, the lead doesn't have a valid street address.",
          "error"
        );
        glMSV.hideLoadingScreenComponent();
      } else {
        $.getJSON(
          glMSV.fetchForwardGeocodedValuesEndpoint
            .replace("{access_key}", apiKeyGeolocationService)
            .replace("{query}", glMSV.arrayLeadDataStored.new_street),
          {}
        )
          .done(function (json) {
            glMSV.arrayForwardGeocodedDataStored = json;
            glMSV.renderMapBeforeFetchingForwardGeocodedCoordinates();
          })
          .fail(function () {
            glMSV.renderMessageBoxSWAL(
              "Service Down",
              "The geolocation service is currently down, please try again later.",
              "error"
            );
            glMSV.hideLoadingScreenComponent();
          });
      }
    },
    fetchLeadDatafromDynamics: function () {
      glMSV.showLoadingScreenComponent();
      $("#tableau").fadeOut("slow");
      $("input").change();
      if ($("#location").hasClass("is-invalid")) {
        glMSV.renderMessageBoxSWAL(
          "Error",
          "Invalid Lead UUID detected, computation can not occur without valid Lead UUID.",
          "error"
        );
        glMSV.hideLoadingScreenComponent();
        return;
      }
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify({ location: $("#location").val() }),
        url: glMSV.currentPageRouteEndpoint,
        success: function (arrayLeadDataStored) {
          glMSV.arrayLeadDataStored = arrayLeadDataStored;
          if (
            null === arrayLeadDataStored.new_longitude ||
            null === arrayLeadDataStored.latitude ||
            false === arrayLeadDataStored.new_longitude ||
            false === arrayLeadDataStored.new_latitude ||
            isNaN(arrayLeadDataStored.new_latitude) ||
            isNaN(arrayLeadDataStored.new_longitude) ||
            !isFinite(arrayLeadDataStored.new_latitude) ||
            Math.abs(arrayLeadDataStored.new_latitude) > 90 ||
            !isFinite(arrayLeadDataStored.new_longitude) ||
            Math.abs(arrayLeadDataStored.new_longitude) > 180
          ) {
            glMSV.renderMessageBoxSWAL(
              "Invalid coordinates detected",
              "The script detected invalid coordinates, will now attempt to geocode the data. ",
              "warning"
            );
            glMSV.fetchForwardGeocodedCoordinatesFromStreetAddress();
          } else {
            glMSV.renderTableforMapPinContent();
            glMSV.renderMapToDOM();
            glMSV.fetchNearbyAgentsDatafromBackend();
          }
        },
        error: function (xhr) {
          glMSV.hideLoadingScreenComponent();
          glMSV.renderMessageBoxSWAL(
            "Failed Retrieving Leads",
            "Server was unable to fulfill your request.",
            "error"
          );
        },
      });
    },
    fetchCheckedBoxesForEmailingAgents: function () {
      var data = [];
      var names = [];

      $(".agent-selector").each(function (i, tuple) {
        if ($(tuple).is(":checked")) {
          data.push($(tuple).data("check"));
          names.push(
            $(tuple).closest("tr").children().find(".agentSingle").data("value")
          );
        }
      });

      if (!data.length) {
        glMSV.renderMessageBoxSWAL(
          "Invalid Selection",
          "No Agents selected. Please select agents via the checkbox button.",
          "error"
        );
      } else {
        glMSV.pushAgentsIDToServerForEmailing(data, names);
      }
    },
    pushAgentsIDToServerForEmailing: function (data, names) {
      glMSV.sendEmail(data, names);
    },
    pushSingleAgentIDToServerForEmailing: function (e) {
      var email = [
        $(this).closest("tr").children().find(".agent-selector").data("check"),
      ];
      var name = [
        $(this).closest("tr").children().find(".agentSingle").data("value"),
      ];
      glMSV.sendEmail([email], [name]);
    },
    validateInputBoxValue: function (ele) {
      var $selectedElement = $(ele);
      $selectedElement.removeClass("is-invalid");
      var $type = $selectedElement.attr("validation");
      switch ($type) {
        case "location":
          if (
            $selectedElement
              .val()
              .match(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i)
          ) {
            $selectedElement.addClass("is-invalid");
          }
          break;
        case "subject":
          if (
            $selectedElement
              .val()
              .match(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i)
          ) {
            $selectedElement.addClass("is-invalid");
          }
          break;
        case "email":
          if (!$selectedElement.val().match(/^(.+)@(.+)$/gi)) {
            $selectedElement.addClass("is-invalid");
          }
          break;
        case "search":
          if ($selectedElement.val().match(/(^\s+$|^$)/i)) {
            $(".filtered").removeClass("filtered");
          } else {
            glMSV.filterOutput($selectedElement.val());
          }
          break;
      }
    },
    sendEmail: (emailDataArray, emailRecipients = []) => {
      var sender = $("#sender").val() || "default";
      glMSV.showLoadingScreenComponent();
      $.ajax({
        type: "POST",
        contentType: "application/json",
        url: glMSV.emailAgentsAPIEndpoint,
        data: JSON.stringify({
          to: emailDataArray,
          content: glMSV.emailContentsUpsert,
          names: emailRecipients,
          sender: sender,
          subject: glMSV.subject,
        }),
        success: function (data) {
          glMSV.renderMessageBoxSWAL(
            data.title || "Successfully Dispatched",
            data.message ||
              "An autogenerated email for the selected agent/s have been dispatched.",
            data.icon || "success"
          );
          glMSV.hideLoadingScreenComponent();
        },
        error: function (data) {
          glMSV.hideLoadingScreenComponent();
          glMSV.renderMessageBoxSWAL(
            data.title || "Email couldn't be sent.",
            data.message ||
              "Dispatching of email failed due to mail server issues. Please try again later.",
            data.icon || "error"
          );
        },
      });
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

      if (glMSV.matchRegexUUID(sanitizedValue)) {
        sanitizedValue = glMSV.matchRegexUUID(sanitizedValue)[0].slice(4);
        $selectedElementToSanitize.val(sanitizedValue).change();
      } else {
        $selectedElementToSanitize.val(sanitizedValue).change();
      }
    },
    filterOutput: function (query) {
      var filteredResults = $(".agentSingle")
        .map(function () {
          return $(this).data("value");
        })
        .get();
      var result = filteredResults.filter(function (el) {
        return el.includes(query);
      });
      glMSV.showOnlyViableAgentRows(result);
    },
    showOnlyViableAgentRows: function (filteredResults) {
      $(`div#tableAgentsListView>table>tbody>tr`).addClass("filtered");
      filteredResults.forEach(function (singleValue) {
        $(`.agentSingle[data-value="${singleValue}"]:hidden`)
          .closest("tr")
          .removeClass("filtered");
      });
    },
    matchRegexUUID: function (str) {
      return str.match(
        /&id=\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
      );
    },
    manageAllCachedAgentsEvents: function () {
      $("#tableAgentsListView")
        .empty()
        .append(glMSV.arrayAgentsCachedCollectionData.data);
      $(".view-single")
        .off()
        .on("click", glMSV.renderCurrentlySelectedAgentAsModal);
      $("#sendEmailAgents")
        .off()
        .on("click", glMSV.fetchCheckedBoxesForEmailingAgents);
      $(".email-single")
        .off()
        .on("click", glMSV.pushSingleAgentIDToServerForEmailing);
    },
  };

  window.glMSV = glMSV;

  // Boot up and remove loading.
  $(document).ready(function () {
    switch (document.location.pathname) {
      case "/geolocation":
        window.glMSV.emailContentsUpsert = glMSV.emailBodyContent;
        setTimeout(window.glMSV.initDOM, 500);
        break;

      default:
        setTimeout(window.glMSV.hideLoadingScreenComponent, 500);
        console.log("[Load finished] No scripts loaded");
    }
  });
})(jQuery.noConflict(), L);
