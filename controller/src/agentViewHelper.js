"use strict";
require("dotenv").config();

class AgentViewHelper {
  constructor(params) {
    this.params = params;
  }

  getSingleTupleTemplate() {
    return `<table style="margin:1rem;width: 50%;text-align: left">
              <tbody>
                <tr>
                  <td style="background:#f1f1f1;padding:10px">Full Name</td>
                  <td><b> &nbsp;&nbsp;{cr4f2_fullname}</b></td>
                </tr>
                <tr>
                  <td style="background:#f1f1f1;padding:10px">Email address</td>
                  <td><b> &nbsp;&nbsp;{new_email}</b></td>
                </tr>
                <tr>
                  <td style="background:#f1f1f1;padding:10px">Phone Number</td>
                  <td><b> &nbsp;&nbsp;{new_phone}</b></td>
                </tr>
                    <tr>
                  <td style="background:#f1f1f1;padding:10px">Company Name</td>
                  <td><b> &nbsp;&nbsp;{new_companyname}</b></td>
                </tr>
                    <tr>
                  <td style="background:#f1f1f1;padding:10px">Address</td>
                  <td><b> &nbsp;&nbsp;{new_address}</b></td>
                </tr>
                    <tr>
                  <td style="background:#f1f1f1;padding:10px">City</td>
                  <td><b> &nbsp;&nbsp;{new_city}</b></td>
                </tr>
                <tr>
                  <td style="background:#f1f1f1;padding:10px">Zip Code</td>
                  <td style=""><b> &nbsp;&nbsp;{new_zipcode}</b></td>
                </tr>
              </tbody>
            </table>`
      .replace(/\s{2,}/g, "")
      .trim();
  }

  
  outputSingleAgent(agentTuple) {
    return this.getSingleTupleTemplate()
      .replace("{cr4f2_fullname}", agentTuple.cr4f2_fullname || "(empty)")
      .replace("{new_email}", agentTuple.new_email || "(empty)")
      .replace("{new_phone}", agentTuple.new_phone || "(empty)")
      .replace("{new_companyname}", agentTuple.new_companyname || "(empty)")
      .replace("{new_address}", agentTuple.new_address || "(empty)")
      .replace("{new_city}", agentTuple.new_city || "(empty)")
      .replace("{new_zipcode}", agentTuple.new_zipcode || "(empty)");
  }

  getRowTemplate() {
    // Returns trimmed template by regex.
    // Used ES6 templating for readability.
    return `<tr data-id="{id}">
              <td>
                  <input data-check="{id}" class="form-check-input agent-selector" type="checkbox" value="">
              </td>
              
              <td>
                <a class="agentSingle" data-value="{name}" href="{hotlink}" target="_blank">{name}</a>
              </td>

              <td>
                <a href="{map_link}" target="_blank">{icon-map}</a>&nbsp;
                &nbsp;<a class="clickable view-single">{icon-eye}</a>&nbsp;
                &nbsp;<a class="clickable email-single">{icon-mail}</a>&nbsp;
              </td>
            </tr>`
      .replace(/\s{2,}/g, "")
      .trim();
  }

  getTableHeadTemplate() {
    return `<thead>
              <tr>
                <th></th>
                <th>Agent</th>
                <th>Actions</th>
              </tr>
            </thead>`
      .replace(/\s{2,}/g, "")
      .trim();
  }

  getTableTemplate() {
    return `<table class="table table-hover">
            {thead}
            <tbody>{tbody}</tbody>
          </table>`
      .replace(/\s{2,}/g, "")
      .trim();
  }

  getIcon(param = "") {
    switch (param) {
      case "eye":
        return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>';
      case "pin":
        return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16"><path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/><path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>';
      case "mail":
        return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/></svg>';
      default:
        return "";
    }
  }

  getparams() {
    return this.params;
  }

  reducerAgentsCollection(singleTuple) {
    return this.getRowTemplate()
      .replace(/{id}/g, singleTuple.id)
      .replace(/{name}/g, singleTuple.name)
      .replace("{hotlink}", singleTuple.url)
      .replace(
        "{map_link}",
        `https://maps.google.com/maps?q=${singleTuple.latitude},${singleTuple.longitude}`
      )
      .replace("{icon-map}", this.getIcon("pin"))
      .replace("{icon-eye}", this.getIcon("eye"))
      .replace("{icon-mail}", this.getIcon("mail"));
  }

  outputAgentsCollection() {
    let content = "";
    this.params.forEach((singleTuple) => {
      content += this.reducerAgentsCollection(singleTuple);
    });

    return this.getTableTemplate()
      .replace("{thead}", this.getTableHeadTemplate())
      .replace("{tbody}", content);
  }
}

module.exports = AgentViewHelper;
