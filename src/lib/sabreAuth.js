// let cachedToken = null;
// let tokenExpiry = null;

// // Named export
// export async function getSabreToken() {
//   if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

//   console.log("CLIENT_ID:", JSON.stringify(process.env.SABRE_CLIENT_ID));
// console.log("CLIENT_SECRET:", JSON.stringify(process.env.SABRE_CLIENT_SECRET));

// const res = await fetch(`${process.env.SABRE_BASE_URL}/v2/auth/token`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//     Authorization:
//       "Basic " +
//       Buffer.from(
//         `${process.env.SABRE_CLIENT_ID}:${process.env.SABRE_CLIENT_SECRET}`
//       ).toString("base64"),
//   },
//   body: "grant_type=client_credentials",
// });

// const text = await res.text();

// console.log("SABRE RAW RESPONSE:", text);
// console.log("STATUS:", res.status);

// if (!res.ok) {
//   throw new Error(`Sabre Auth Failed: ${text}`);
// }

// const data = JSON.parse(text);

// return data.access_token; }
//   const res = await fetch(`${process.env.SABRE_BASE_URL}/v2/auth/token`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization:
//         "Basic " +
//         Buffer.from(
//           `${process.env.SABRE_CLIENT_ID}:${process.env.SABRE_CLIENT_SECRET}`
//         ).toString("base64"),
//     },
//     body: "grant_type=client_credentials",
//   });

//   const data = await res.json();

//   cachedToken = data.access_token;
//   tokenExpiry = Date.now() + data.expires_in * 1000;

//   return cachedToken;










// import axios from "axios";

// let cachedToken = null;
// let tokenExpiresAt = null;

// export async function getSabreToken() {
//   const now = Date.now();

//   // Return cached token if still valid (with 30s buffer)
//   if (cachedToken && tokenExpiresAt && now < tokenExpiresAt - 30_000) {
//     console.log("Using cached Sabre token");
//     return cachedToken;
//   }

//   const clientId = process.env.SABRE_CLIENT_ID?.trim();         // used in request body
//   const clientIdFull = process.env.SABRE_CLIENT_ID_FULL?.trim(); // used for Basic auth header
//   const clientSecret = process.env.SABRE_CLIENT_SECRET?.trim();

//   if (!clientId || !clientIdFull || !clientSecret) {
//     throw new Error("Missing Sabre credentials in environment variables");
//   }

//   // Dynamic Basic auth — Base64( Base64(fullClientId) : Base64(clientSecret) )
//   const encodedId = Buffer.from(clientIdFull).toString("base64");
//   const encodedSecret = Buffer.from(clientSecret).toString("base64");
//   const basicAuth = Buffer.from(`${encodedId}:${encodedSecret}`).toString("base64");

//   const body = new URLSearchParams({
//     grant_type: "client_credentials",
//     client_id: clientId,
//     client_secret: clientSecret,
//   }).toString();

//   console.log("=== AUTH DEBUG ===");
// console.log("clientId:", JSON.stringify(clientId));
// console.log("clientIdFull:", JSON.stringify(clientIdFull));
// console.log("clientSecret:", JSON.stringify(clientSecret));
// console.log("encodedId:", encodedId);
// console.log("encodedSecret:", encodedSecret);
// console.log("basicAuth:", basicAuth);
// console.log("URL:", process.env.SABRE_BASE_URL);
// console.log("==================");

//   try {
//     const response = await axios.post(
//       `${process.env.SABRE_BASE_URL}/v2/auth/token`,
//       body,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: `Basic ${basicAuth}`,
//           Accept: "application/json",
//         },
//         timeout: 10000,
//       }
//     );

//     cachedToken = response.data.access_token;
//     const expiresIn = response.data.expires_in ?? 604800;
//     tokenExpiresAt = now + expiresIn * 1000;

//     console.log("New Sabre token fetched, expires in", expiresIn, "seconds");
//     return cachedToken;

//   } catch (err) {
//     console.error("Sabre auth failed:", err.response?.data || err.message);
//     throw err;
//   }
// }


import axios from "axios";

let cachedToken = null;
let tokenExpiresAt = null;

export async function getSabreToken() {
  const now = Date.now();

  // Use cached token if still valid
  if (cachedToken && tokenExpiresAt && now < tokenExpiresAt - 30000) {
    console.log("Using cached Sabre token");
    return cachedToken;
  }

  const clientIdFull = process.env.SABRE_CLIENT_ID?.trim(); // FULL string
  const clientSecret = process.env.SABRE_CLIENT_SECRET?.trim();

  if (!clientIdFull || !clientSecret) {
    throw new Error("Missing Sabre credentials");
  }

  // 🔥 Sabre-specific encoding
  // Step 1: Base64 encode BOTH separately
  const encodedId = Buffer.from(clientIdFull).toString("base64");
  const encodedSecret = Buffer.from(clientSecret).toString("base64");

  // Step 2: Combine and encode again
  const basicAuth = Buffer.from(`${encodedId}:${encodedSecret}`).toString("base64");

  const body = new URLSearchParams({
    grant_type: "client_credentials",
  }).toString();

  console.log("=== SABRE AUTH DEBUG ===");
  console.log("clientIdFull:", clientIdFull);
  console.log("encodedId:", encodedId);
  console.log("encodedSecret:", encodedSecret);
  console.log("basicAuth:", basicAuth);
  console.log("URL:", process.env.SABRE_BASE_URL);
  console.log("========================");

  try {
    const response = await axios.post(
      `${process.env.SABRE_BASE_URL}/v2/auth/token`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    cachedToken = response.data.access_token;
    const expiresIn = response.data.expires_in ?? 604800;
    tokenExpiresAt = now + expiresIn * 1000;

    console.log("✅ Token fetched. Expires in:", expiresIn);
    return cachedToken;

  } catch (err) {
    console.error("❌ Sabre auth failed:");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    throw err;
  }
}