document.getElementById("close-button").addEventListener("click", function () {
  window.close();
});

document
  .getElementById("getCurrentUrlButton")
  .addEventListener("click", getCurrentURL);

document.getElementById("button-url2").addEventListener("click", checkUrl);

var resultImage = document.getElementById("resultImage");

// Hide the result image and reset its style

resultImage.src = "./Assets/shield.gif";
resultImage.style.width = "300px";
resultImage.style.height = "300px";

function checkUrl() {
  var url = document.getElementById("urlInput").value;
  var resultCard = document.getElementById("resultCard");

  // Make an asynchronous request to the Flask server using fetch or XMLHttpRequest
  // Show loading image while waiting for the response
  resultImage.style.display = "block";
  resultImage.src = "./Assets/loading.gif";
  resultImage.style.width = "300px"; // Adjust the width as needed
  resultImage.style.height = "300px"; // Adjust the height as needed

  fetch(`http://127.0.0.1:5000/singleURL/${encodeURIComponent(url)}`)
    .then((response) => response.json())
    .then((data) => {
      // Update the content of the result card based on the received data
      resultImage.style.display = "none";
      updateResultCard(resultCard, data);
    })
    .catch((error) => {
      // Handle errors (e.g., display an error image)
      resultImage.src = "./Assets/error.gif";
      resultImage.style.width = "50px"; // Adjust the width as needed
      resultImage.style.height = "50px"; // Adjust the height as needed
      console.error("Error:", error);
    })
    .finally(() => {
      // Hide the result image if the src attribute is not set
      if (!resultImage.src) {
        resultImage.style.display = "none";
      }
    });
}

function getCurrentURL() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentUrl = tabs[0].url;
    console.log("Current URL:", currentUrl);
    document.getElementById("urlInput").value = currentUrl;
  });
}

function updateResultCard(resultCard, data) {
  // Check if data.features is an object
  if (typeof data.features === "object") {
    // Update the content of the result card based on the received data
    resultCard.innerHTML = `
<div class="card">
<div class="card-header fs-5">${
      data.is_phishing ? "Phishing URL" : "Safe URL"
    }</div>
<div class="card-body">
<div class="card-title fs-6 overflow-hidden">URL: ${data.url}</div>
<div class="d-flex flex-wrap m-1 gap-1 overflow-y-auto"> 
  ${Object.entries(data.features)
    .map(
      ([featureName, featureValue]) =>
        `<a href="#" class="btn btn-${
          featureValue === 0 ? "primary" : "danger"
        } btn-sm">${
          featureName == "getDomain" ? featureValue : featureName
        }</a>`
    )
    .join("")}
</div>
</div>
</div>
`;
  } else {
    // Handle the case where data.features is not an object
    resultCard.innerHTML = `
<div class="card">
<h5 class="card-header">Phishing / Safe</h5>
<div class="card-body">
<div class="card-title">URL: ${data.url}</div>
<div class="card-text">Invalid or missing features data</div>
</div>
</div>
`;
    console.error("Invalid or missing features data:", data.features);
  }
}

// logic for scan whole page

// Function to scan the current page for URLs
function getUrlsFromPage() {
  // Get all anchor elements on the page
  const allLinks = document.links;

  // Convert the HTMLCollection to an array and map the href attributes
  const urls = Array.from(allLinks).map((link) => link.href);

  // Filter out empty and non-HTTP(s) URLs
  const validUrls = urls.filter((url) => url && /^https?:\/\//i.test(url));

  console.log("Scanned URLs:", validUrls); // Log the scanned URLs

  return validUrls;
}

// Function to update the UI with the scan results
function updateUIWithResults(results) {
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = ""; // Clear previous results

  results.forEach((result) => {
    const urlDiv = document.createElement("div");
    urlDiv.textContent = result.url;
    urlDiv.style.color = result.isPhishing ? "red" : "blue";
    resultContainer.appendChild(urlDiv);
  });
}

// Function to handle the button click event
function handleButtonClick() {
  const imageElement = document.getElementById("resultImage1");
  const resultContainer = document.getElementById("result");

  // Display loading image
  imageElement.src = "./Assets/loading.gif";

  // Get URLs from the current page
  const urls = getUrlsFromPage();

  // Check if there are valid URLs before making the fetch request
  if (urls.length === 0) {
    console.error("No valid URLs found on the page.");
    return;
  }

  // Log the request payload before making the fetch request
  console.log("Request Payload:", JSON.stringify({ urls }));

  // Simulate an AJAX request to the /batchURL route
  fetch("http://127.0.0.1:5000/batchURL", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ urls }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Update UI with the scan results
      updateUIWithResults(data.results);

      // Display result container
      resultContainer.style.display = "block";

      // Replace loading image with an empty src
      imageElement.src = "";
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle error if needed
    });
}

// Attach click event handler to the button
document
  .getElementById("getUrlData")
  .addEventListener("click", handleButtonClick);
