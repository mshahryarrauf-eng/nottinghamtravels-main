import { buildMetadata } from "@/lib/seo";
import ManageProfile from "@/app/components/fullComponent/ManageProfile";

export const metadata = buildMetadata({
  title: "Manage Profile",
  description: "Manage your Nottingham Travels account profile and preferences.",
  path: "/profile/manage",
});

export default function Page() {
  return <ManageProfile />;
}