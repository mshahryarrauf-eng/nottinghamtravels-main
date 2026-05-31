import { buildMetadata } from "@/lib/seo";
import ContactUs from "./ContactUs";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with Nottingham Travels. Our expert travel consultants are available to help you plan your perfect holiday, answer queries, and provide quotes.",
  keywords: [
    "contact travel agent", "travel agent Nottingham",
    "holiday enquiry", "travel consultation", "customer support travel",
  ],
  path: "/contact-us",
});

export default function Page() {
  return <ContactUs />;
}