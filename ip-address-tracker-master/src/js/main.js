//initialize map
var map = L.map("map");

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var myIcon = L.icon({
  iconUrl: "./images/icon-location.svg",
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

  let filledUrl = getApiUrl(inputIP);
  getInitialIPDetails(filledUrl);
});

//build api url depending on user input

const getApiUrl = (userQuery) => {
  const apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=`;
  const apiKey = `at_2TnyIcaRkIbLWo4GkcQV9pPyjMndR`;
  let ipAddress = ``;
  let domain = ``;
  if (isIpAddress(userQuery)) {
    ipAddress = userQuery;
  } else {
    userQuery === undefined ? (ipAddress = ``) : (domain = userQuery);
  }
  console.log("ip address is:", ipAddress);
  console.log("domain is:", domain);
  const url = `${apiUrl}${apiKey}&ipAddress=${ipAddress}&domain=${domain}`;

  return url;
};

//check if input is ip address
function isIpAddress(input) {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]|)[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]|)[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]|)[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]|)[0-9]))$/;
  const ipRegex = new RegExp(`^(${ipv4Regex.source})|(${ipv6Regex.source})$`);
  return ipRegex.test(input);
}

//make api call and populate the app

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
