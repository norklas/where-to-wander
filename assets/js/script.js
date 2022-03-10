// API Key
var campgroundApiKey = "Bmz374aWCDdIEBnTNdAjjyehjiMRkPJpJqGoY9qC";

// Elements
var searchFormEl = $("#search-form");
var searchInput = $("#search-value");
var modalEl = $("#popup-modal");
var modalCloseBtn = $("#close-btn");
var modalErrorText = $("#error-text");
var cardSection = $("#card-section");
var cardContainer = $("#card-container");
var campCards = $("#camp-cards");

// Submit button handler
function formSubmitHandler(e) {
  e.preventDefault();

  // Grabbing value of search input and feeding it into the campgroundData function
  var stateCode = searchInput.val().trim();

  if (stateCode) {
    campgroundData(stateCode);
    searchInput.val("");
  } else {
    modalErrorText.textContent = "Please enter correct state abbreviation!";
    modalEl.style.display = "block";
  }
}

// Function to fetch campground data
function campgroundData(stateCode) {
  fetch(
    `https://developer.nps.gov/api/v1/campgrounds?stateCode=${stateCode}&limit=4&api_key=${campgroundApiKey}`
  ).then(function (response) {
    if (response.ok) {
      return response.json().then(function (data) {
        // console.log(data);
        displayCampgroundInfo(data, stateCode);
      });
    } else {
      modalErrorText.textContent = "No campground data found";
      modalEl.style.display = "block";
    }
  });
}

// Function to display campground information
function displayCampgroundInfo(campgrounds) {
  console.log(campgrounds);

  // Clear old content
  //cardSection.html("");

  // Loop over campgrounds
  for (var i = 0; i < campgrounds.data.length; i++) {
    // Articles for camp cards
    var campInfo = $("<article>");
    campInfo.addClass(
      "flex flex-col md:flex-row md:max-w-xl max-w-xs rounded-lg overflow-hidden shadow-xl text-sm"
    );
    campInfo.attr("id", "camp-info-card");
    campCards.append(campInfo);

    // Creating image element, grabbing image url through data array, setting size, and appending it
    var imgEl = $("<img>");
    imgEl.attr("src", campgrounds.data[i].images[0].url);
    imgEl.addClass("bg-cover w-full md:w-1/2 h-64 md:h-auto");

    campInfo.append(imgEl);

    // Campground name
    var campgroundName = campgrounds.data[i].name;

    // Creating title element, and appending it to camp info article within card container
    var titleEl = $("<h1>");
    titleEl.append(campgroundName);
    titleEl.addClass("text-center text-lg font-bold");

    campInfo.append(titleEl);

    // Creating p elements for address
    // var descriptionEl = $("<p>");
    // descriptionEl.text("Description: " + campgrounds.data[i].description);
    // descriptionEl.addClass("text-sm");

    var campsitesEl = $("<p>");
    campsitesEl.text(
      "Total sites: " + campgrounds.data[i].campsites.totalSites
    );
    campsitesEl.addClass("pl-2");

    var operatingDescriptionEl = $("<p>");
    operatingDescriptionEl.text(
      campgrounds.data[i].operatingHours[0].description
    );
    operatingDescriptionEl.addClass("pl-2");

    var operatingHoursListEl = $("<ul>");

    campInfo.append(operatingDescriptionEl);
    campInfo.append(operatingHoursListEl);
    // campInfo.append(descriptionEl);
    campInfo.append(campsitesEl);

    // Creating p element for cost
    var costEl = $("<p>");
    costEl.text("Cost: $" + campgrounds.data[i].fees[0].cost + " per night");
    costEl.addClass("pl-2");

    campInfo.append(costEl);

    // Creating phone number element
    var phoneEl = $("<a>");
    phoneEl.attr(
      "href",
      campgrounds.data[i].contacts.phoneNumbers[0].phoneNumber
    );
    phoneEl.text(campgrounds.data[i].contacts.phoneNumbers[0].phoneNumber);
    phoneEl.addClass("pl-2");

    campInfo.append(phoneEl);

    // Creating anchor element for more info
    var linkEl = $("<a>");
    linkEl.attr("href", campgrounds.data[i].url);
    linkEl.text("View more info");
    linkEl.addClass("pl-2");

    campInfo.append(linkEl);
  }
}

// Function to close modal
window.onclick = function (event) {
  if (event.target == modalCloseBtn) {
    modalEl.style.display = "none";
  }
};

searchFormEl.on("submit", formSubmitHandler);
