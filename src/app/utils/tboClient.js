// // app/utils/tboClient.js
// export async function tboFetch(endpoint, body = {}, method = "POST") {
//   const username = process.env.TBO_USERNAME;
//   const password = process.env.TBO_PASSWORD;

//   const basicAuth = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

//   const headers = { "Authorization": basicAuth };

//   // Only set Content-Type for requests with a body — IIS/.NET rejects GET with Content-Type
//   if (method !== "GET") {
//     headers["Content-Type"] = "application/json";
//   }

//   const options = { method, headers };

//   if (method !== "GET") {
//     options.body = JSON.stringify(body);
//   }

//   const res = await fetch(`http://api.tbotechnology.in/TBOHolidays_HotelAPI/${endpoint}`, options);

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`TBO API Error: ${text}`);
//   }

//   return res.json();
// }

// app/utils/tboClient.js
export async function tboFetch(endpoint, body = {}, method = "POST") {
  const username = process.env.TBO_USERNAME;
  const password = process.env.TBO_PASSWORD;

  const basicAuth = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  const headers = { "Authorization": basicAuth };

  // Only set Content-Type for requests with a body — IIS/.NET rejects GET with Content-Type
  if (method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  const options = { method, headers };

  if (method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`http://api.tbotechnology.in/TBOHolidays_HotelAPI/${endpoint}`, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TBO API Error: ${text}`);
  }

  return res.json();
}