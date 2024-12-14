// Function to validate IPv4 address using FSA
function isValidIPv4(ip) {
  let state = "q0"; // Start state
  let parts = 0; // Count octets
  let buffer = ""; // Temporary buffer to hold each octet

  for (let i = 0; i < ip.length; i++) {
    const char = ip[i];

    switch (state) {
      case "q0": // Initial state
        if (/[0-9]/.test(char)) {
          state = "q1";
          buffer += char;
        } else {
          return false; // Must start with a digit
        }
        break;

      case "q1": // Reading an octet
        if (/[0-9]/.test(char)) {
          buffer += char;
          if (parseInt(buffer, 10) > 255) return false; // Octet out of range
        } else if (char === ".") {
          state = "q2"; // Transition to expecting a dot
          parts++;
          buffer = ""; // Reset buffer for next octet
        } else {
          return false; // Invalid character
        }
        break;

      case "q2": // Expecting a digit after a dot
        if (/[0-9]/.test(char)) {
          state = "q1";
          buffer += char;
        } else {
          return false; // Invalid character after dot
        }
        break;

      default:
        return false;
    }
  }

  // Validation complete: check the number of parts
  return state === "q1" && ++parts === 4;
}

// Function to fetch IP details from ip-api.com
async function fetchIPDetails(ip) {
  try {
    const response = await fetch(`/api/ip?ip=${ip}`);

    const data = await response.json();

    if (data.status === "success") {
      return `
        <p><strong>IP:</strong> ${data.query}</p>
        <p><strong>City:</strong> ${data.city}</p>
        <p><strong>Region:</strong> ${data.regionName}</p>
        <p><strong>Country:</strong> ${data.country}</p>
        <p><strong>Latitude:</strong> ${data.lat}</p>
        <p><strong>Longitude:</strong> ${data.lon}</p>
        <p><strong>ISP:</strong> ${data.isp}</p>
      `;
    } else {
      return `<p style="color: red;">Could not fetch details for the given IP.</p>`;
    }
  } catch (error) {
    return `<p style="color: red;">Error fetching IP details: ${error.message}</p>`;
  }
}

// fetch ip on load
async function fetchAndDisplayPublicIP() {
  const result = document.getElementById("details");
  try {
    // Ambil detail IP publik menggunakan ipinfo.io
    const response = await fetch("https://ipinfo.io/json?token=YOUR_TOKEN_HERE");
    const data = await response.json();

    console.log("IP Info:", data);

    result.innerHTML = `
      <p><strong>IP:</strong> ${data.ip}</p>
      <p><strong>City:</strong> ${data.city}</p>
      <p><strong>Region:</strong> ${data.region}</p>
      <p><strong>Country:</strong> ${data.country}</p>
      <p><strong>Location:</strong> ${data.loc}</p>
      <p><strong>ISP:</strong> ${data.org}</p>
    `;
  } catch (error) {
    console.error("Error:", error.message);
    result.innerHTML = `<p style="color: red;">Error fetching IP details: ${error.message}</p>`;
  }
}



// Automatically fetch public IP details on page load
window.onload = function () {
  fetchAndDisplayPublicIP();

  document
    .getElementById("ip-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const ip = document.getElementById("ip-input").value;
      const result = document.getElementById("details");

      if (isValidIPv4(ip)) {
        result.innerHTML = `<p style="color: green;">${ip} is a valid IPv4 address. Fetching details...</p>`;
        const details = await fetchIPDetails(ip);
        result.innerHTML = details;
      } else {
        result.innerHTML = `<p style="color: red;">${ip} is not a valid IPv4 address.</p>`;
      }
    });
};
