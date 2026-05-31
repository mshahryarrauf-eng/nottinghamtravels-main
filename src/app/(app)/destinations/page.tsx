import { buildMetadata } from "@/lib/seo";
import DestinationsPage from "@/app/components/fullComponent/DestinationPage";

export const metadata = buildMetadata({
  title: "Explore Destinations",
  description: "Discover handpicked travel destinations worldwide. From European getaways to exotic Asian escapes — find your perfect holiday destination with Nottingham Travels.",
  keywords: [
    "travel destinations", "holiday destinations UK", "Europe holidays",
    "Asia holidays", "Middle East travel", "luxury holidays",
    "top travel destinations 2025",
  ],
  path: "/destinations",
});

export default function Page() {
  return <DestinationsPage />;
}