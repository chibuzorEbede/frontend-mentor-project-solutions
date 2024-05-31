//initialize map
var map = L.map("map");
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
var myIcon = L.icon({
  iconUrl: "../src/images/icon-location.svg",
  iconSize: [48, 63],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowSize: [68, 95],
  shadowAnchor: [22, 94],
});

//setup form

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputIP = document.getElementById("input_ip").value;
  //do some checks here on inputIP
  !inputIP ? `` : inputIP;
  let filledUrl = getApiUrl(inputIP);
  getInitialIPDetails(filledUrl);
});

//build api url depending on user input

const getApiUrl = (userIP = "") => {
  const apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=`;
  const apiKey = `at_2TnyIcaRkIbLWo4GkcQV9pPyjMndR`;
  const ipAddress = userIP;

  const url = `${apiUrl}${apiKey}&ipAddress=${ipAddress}`;

  return url;
};

let url = getApiUrl();

const getInitialIPDetails = (url) => {
  let data = {};

  try {
    fetch(url)
      .then((res) => res.json())
      .then((responseData) => {
        //initialize the details from the response
        setIPDetails(responseData);
      });
  } catch (error) {
    console.log(error);
  }
  return data;
};

getInitialIPDetails(url);

const setIPDetails = (data) => {
  // select elements from DOM
  const ipElement = document.querySelector("#user_ip");
  const userLocationElement = document.querySelector("#user_location");
  const userTimeZoneElement = document.querySelector("#user_timezone");
  const userIspElement = document.querySelector("#user_isp");

  //data from server
  const { ip, location, isp } = data;

  //set the IPdetails
  ipElement.textContent = ip;
  userLocationElement.textContent = `${location.region}, ${location.city} ${location.postalCode}`;
  userTimeZoneElement.textContent = `UTC${location.timezone}`;
  userIspElement.textContent = isp;

  // re-build the map
  map.setView([location.lat, location.lng], 13);
  L.marker([location.lat, location.lng], { icon: myIcon }).addTo(map);
  //end map
};
