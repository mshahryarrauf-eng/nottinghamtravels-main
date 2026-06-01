import { buildMetadata } from "@/lib/seo";
import HotelResultsPage from "@/app/components/fullComponent/HotelsResultsPage";

export const metadata = buildMetadata({
  title: "Hotel Search Results",
  description: "Browse and book hotels from your search results with Nottingham Travels.",
  path: "/bookings/hotels",
  noIndex: true,
});

export default function Page() {
  return <HotelResultsPage />;
}