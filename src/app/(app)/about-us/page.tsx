// src/app/(app)/about-us/page.jsx
import AboutHero from "@/app/components/about/aboutHero"
import AboutStats from "@/app/components/about/aboutStats"
import AboutStory from "@/app/components/about/aboutStory"
import AboutValues from "@/app/components/about/aboutValues"
import AboutTimeline from "@/app/components/about/aboutTimeline"
import AboutCTA from "@/app/components/about/aboutCTA"

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Nottingham Travels — your trusted travel partner since 1999. ATOL & ABTA protected, serving thousands of families across the UK with expert holiday planning.",
  keywords: [
    "about Nottingham Travels", "ATOL protected travel agent",
    "ABTA travel agency", "UK travel agent history", "trusted travel company",
  ],
  path: "/about-us",
});

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutStats />
      <AboutStory />
      <AboutTimeline />
      <AboutValues />
      <AboutCTA />
    </main>
  )
}
