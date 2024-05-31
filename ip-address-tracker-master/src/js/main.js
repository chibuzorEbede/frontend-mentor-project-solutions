//get a users ip on initial page load

//ip address by the user

// const getUserIP = ()=>{
//   //return  the ip in the ip field
// }

const getApiUrl = (userIP = "") => {
  //get the userinput ip or leave empty to get public address

  const apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=`;
  const apiKey = `at_2TnyIcaRkIbLWo4GkcQV9pPyjMndR`;
  const ipAdress = userIP;

  const url = `${apiUrl}${apiKey}&ipAddress=${ipAdress}`;

  return url;
};

//make a request to the api and save the response

let url = getApiUrl();

const getInitialIPDetails = async (url) => {
  let data = {};

  try {
    const details = await fetch(url);
    data = await details.json();
  } catch (error) {
    console.log(error);
  }

  return data;
};

const apiResponse = await getInitialIPDetails(url);
console.log("api response:", apiResponse);

const { ip, location, as, isp } = apiResponse;

// build the map

var map = L.map("map").setView([location.lat, location.lng], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
