import { searchFlightsFromSabre } from "@/lib/sabreSearch";
import { rateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rateLimit";

export async function POST(req) {
  const limit = rateLimit(req, RATE_LIMIT_CONFIGS.search);
  if (!limit.success) return limit.response;

  try {
    const body = await req.json();
    console.log("Incoming body:", body); // 👈 ADD THIS

    const data = await searchFlightsFromSabre(body);
        console.log("Sabre response:", data);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
        console.error("FULL ERROR:", err); // 👈 IMPORTANT

    return new Response(JSON.stringify({ error: "Flight search failed" }), {
      status: 500,
    });
  }
}
