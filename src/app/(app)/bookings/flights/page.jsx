import { buildMetadata } from "@/lib/seo";
import FlightResultsPage from "@/app/components/fullComponent/FlightsResultsPage";

export const metadata = buildMetadata({
  title: "My Flight Bookings",
  description: "View and manage your flight bookings with Nottingham Travels.",
  path: "/bookings/flights",
  noIndex: true,
});

export default function Page() {
  return <FlightResultsPage />;
}