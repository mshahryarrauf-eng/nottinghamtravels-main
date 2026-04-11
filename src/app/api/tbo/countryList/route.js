// import { tboFetch } from "@/app/utils/tboClient";

// export async function GET() {
//   try {
//     // TBO CountryList is a GET endpoint
//     const data = await tboFetch("CountryList", {}, "GET");

//     if (!data) {
//       return new Response(JSON.stringify({ error: "Empty response from TBO" }), {
//         status: 502,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     return new Response(JSON.stringify(data), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     console.error("CountryList Error:", err.message);
//     return new Response(
//       JSON.stringify({ error: err.message }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

import { tboFetch } from "@/app/utils/tboClient";

export async function GET() {
  try {
    const data = await tboFetch("CountryList", {}, "GET");

    // Log full response so we can see exactly what TBO returns
    console.log("TBO CountryList full response:", JSON.stringify(data));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("CountryList Error:", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}