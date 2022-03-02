console.log("Ldapy app.js now running");


// Handles clicking the submit button, which triggers the 
// username search
const submitOnClick = function (event) {
  // Get the username to search for    
  let username = document.getElementById("searchInput").value;
  // Get the base URL to search with
  let baseUrl = document.querySelector("meta[itemProp=backend_url]").getAttribute("content");
  // The result area...clear it
  let resultBar = document.getElementById("resultsbar")
  let nodesToRemove = Array.from(resultBar.getElementsByTagName("fieldset"))
  for (let node of nodesToRemove) {
    node.remove()
  };
  // The status bar
  let footerDiv = document.getElementById("footerbar");
  footerDiv.innerHTML = "Querying for: " + username;
  // Issue an HTTP GET request to get the data from the backend
  // :NOTE: Need to timeout if takes longer than N seconds.
  fetch(`${baseUrl}/user/${username}`)
    .then((response) => {
      // If the response is good, get the data as a a Javascript object
      if (response.ok) {
        footerDiv.innerHTML = response.statusText;
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then((jsonobj) => {
      // Parse the JSON data object and display the attributes      
      let attrListDisplayOrder = [
        "sAMAccountName",
        "displayName",
        "title",
        "department",
        "mail",
        "telephoneNumber",
        "manager",
        "memberOf",
        "givenName",
        "sn",
        "objectGUID",
        "objectCategory",
        "objectClass"
      ];
      for (let attr of attrListDisplayOrder) {
        // Create a "card" for each attribute, within which the list of 
        // values for the attribute will be filled
        let attributeCard = document.createElement("fieldset")
        attributeCard.id = "Attribute-" + attr;
        attributeCard.classList.add("attributeCard")
        let attributeLegend = document.createElement("legend")
        attributeLegend.classList.add("attributeLegend");
        attributeLegend.for = "Attribute-" + attr;
        attributeLegend.innerHTML = attr;
        attributeCard.appendChild(attributeLegend);
        
        // Create a text node for each value in the data list associated
        // with the attribute
        for (let val of jsonobj["attributes"][attr]) {
          let attributeVal = document.createElement("p");
          attributeVal.classList.add("attributeVal");
          attributeVal.innerHTML = val;
          attributeCard.appendChild(attributeVal);
        }        
        //resultText.innerHTML = key;
        resultBar.appendChild(attributeCard);
      }
    })
    .catch((e) => {
      footerDiv.innerHTML = e;
    });
}



function inputEnterPress(event) {
  if (event.key === 'Enter') {
    submitOnClick(event);
  }
}

// Create a header area to identify the tool, then, a request
// area with a username and search button, and then, a results panel.
const mainNode = document.querySelector("main");
mainNode.innerHTML = "";


let headerDiv = document.createElement("header")
headerDiv.id = "headerbar";
headerDiv.innerHTML = "Ldapy - Username Lookup";
mainNode.appendChild(headerDiv);


let searchDiv = document.createElement("div");
searchDiv.id = "searchbar";
mainNode.appendChild(searchDiv);

let searchLabel = document.createElement("label")
searchLabel.innerHTML = "Username:";
searchDiv.appendChild(searchLabel);

let searchInput = document.createElement("input");
searchInput.id = "searchInput";
searchInput.setAttribute("type", "search");
searchInput.addEventListener("keydown", inputEnterPress);
searchDiv.appendChild(searchInput);

let searchButton = document.createElement("button");
searchButton.classList.add("buttonclass");
searchButton.id = "submitButton";
searchButton.innerHTML = "Submit";
searchButton.addEventListener("click", submitOnClick);
searchDiv.appendChild(searchButton);

let resultsDiv = document.createElement("div");
resultsDiv.id = "resultsbar";
resultsDiv.innerHTML = "Results";
mainNode.appendChild(resultsDiv);

let footerDiv = document.createElement("footer");
footerDiv.id = "footerbar";
footerDiv.innerHTML = "Ldapy Idle";
mainNode.appendChild(footerDiv);


// Callback to alter the DOM to display the results of the LDAP query
// returned from teh backend

