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