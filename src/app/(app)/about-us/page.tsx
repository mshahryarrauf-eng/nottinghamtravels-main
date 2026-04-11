// src/app/(app)/about-us/page.jsx
import AboutHero from "@/app/components/about/aboutHero"
import AboutStats from "@/app/components/about/aboutStats"
import AboutStory from "@/app/components/about/aboutStory"
import AboutValues from "@/app/components/about/aboutValues"
import AboutTimeline from "@/app/components/about/aboutTimeline"
import AboutCTA from "@/app/components/about/aboutCTA"

export const metadata = {
  title: "About Us | Nottingham Travel",
  description:
    "Nottingham Travel — your trusted travel partner since 1999. ATOL & ABTA protected, serving thousands of families across the UK.",
}

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
