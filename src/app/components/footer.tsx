"use client"

import { FaHome, FaPhoneAlt, FaEnvelope } from "react-icons/fa"
import { Plane, Hotel, Package, Star, Info, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaInstagram, FaTiktok, FaFacebookF } from "react-icons/fa";


// Scrolls to the search section and switches to the right tab
function SearchLink({
  tab,
  children,
  icon: Icon,
}: {
  tab: "flights" | "hotels" | "packages"
  children: React.ReactNode
  icon: React.ElementType
}) {
  const router = useRouter()

const handleClick = () => {
  // Go to homepage first
  if (window.location.pathname !== "/") {
    router.push("/")
    setTimeout(() => {
      window.location.hash = `search-${tab}`
    }, 300)
  } else {
    // Already on homepage → just update hash
    window.location.hash = `search-${tab}`
  }
}

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-sm text-black hover:text-[#191F54] transition-colors duration-200 text-left"
    >
      <Icon size={13} strokeWidth={1.8} />
      {children}
    </button>
  )
}
const Footer = () => {
  return (
    <footer className="bg-[#f6f6f6]">
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, #78B43C, #0096D2, #78B43C)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 items-start">

        {/* ── Col 1: Logo + tagline ── */}
        <div className="md:col-span-1">
          <Image
            src="/assets/Notigham-logo.png"
            alt="Nottingham Travel"
            width={130}
            height={90}
            className="mb-4"
          />
          <p className="text-xs text-black leading-relaxed max-w-[200px]">
            Your trusted travel partner since 1999. ATOL &amp; ABTA protected.
          </p>
          {/* Trust badges */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {["ATOL", "ABTA"].map((b) => (
              <span key={b} className="text-xs font-bold px-2.5 py-1 rounded-full border border-[#191F54]/20 text-black">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* ── Col 2: Quick Links ── */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-5">
            Quick Links
          </h3>
          <div className="space-y-3">
            <SearchLink tab="flights"  icon={Plane}  >Flights</SearchLink>
            <SearchLink tab="hotels"   icon={Hotel}  >Hotels</SearchLink>
            <SearchLink tab="packages" icon={Package}>Packages</SearchLink>
            <Link href="/s" className="flex items-center gap-2 text-sm text-black hover:text-[#191F54] transition-colors duration-200">
              <Star size={13} strokeWidth={1.8} /> Special Offers
            </Link>
            <Link href="/religious-tone" className="flex items-center gap-2 text-sm text-black hover:text-[#191F54] transition-colors duration-200">
              <Package size={13} strokeWidth={1.8} /> Religious Tours
            </Link>
            <Link href="/about-us" className="flex items-center gap-2 text-sm text-black hover:text-[#191F54] transition-colors duration-200">
              <Info size={13} strokeWidth={1.8} /> About Us
            </Link>
            <Link href="/tailor-made-query" className="flex items-center gap-2 text-sm text-black hover:text-[#191F54] transition-colors duration-200">
              <Mail size={13} strokeWidth={1.8} /> Special Query
            </Link>
          </div>
        </div>

        {/* ── Col 3: Get In Touch ── */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-5">
            Get In Touch
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-black flex-shrink-0" size={13} />
              <a href="tel:01159787899" className="text-sm text-black hover:text-[#191F54] transition-colors">
                01159 78 78 99
              </a>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-black flex-shrink-0" size={13} />
              <a href="mailto:sales@nottinghamtravel.com" className="text-sm text-black hover:text-[#191F54] transition-colors">
                sales@nottinghamtravel.com
              </a>
            </div>
            <div className="flex items-start gap-3">
              <FaHome className="text-vlack flex-shrink-0 mt-0.5" size={13} />
              <p className="text-sm text-black leading-relaxed">
                161 Radford Road, Hyson Green<br />
                Nottingham NG7 5EH
              </p>
            </div>
          </div>
        </div>

        {/* ── Col 4: Bradford Branch ── */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-5">
            Bradford Branch
          </h3>
          <div className="flex items-start gap-3">
            <FaHome className="text-black flex-shrink-0 mt-0.5" size={13} />
            <p className="text-sm text-black leading-relaxed">
              830 Leeds Road<br />
              Bradford BD3 9TX
            </p>
          </div>

          {/* Social Links */}

<div className="mt-5 space-y-2">
  <p className="text-xs font-bold uppercase tracking-widest text-black mb-2">
    Follow Us
  </p>

  <div className="flex gap-3 text-black">
    <a
      href="https://www.instagram.com/nottinghamtravel/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-pink-500 transition"
    >
      <FaInstagram size={16} />
    </a>

    <a
      href="https://www.tiktok.com/@nottstravels"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-black transition"
    >
      <FaTiktok size={16} />
    </a>

    <a
      href="https://www.facebook.com/nottinghamtraveluk/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-600 transition"
    >
      <FaFacebookF size={16} />
    </a>
  </div>
</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t py-5 text-center text-xs text-black leading-relaxed px-4"
        style={{ borderColor: "rgba(25,31,84,0.1)" }}
      >
        © {new Date().getFullYear()} Nottingham Travel. All rights reserved.
        <span className="mx-2 opacity-40">·</span>
        Many flights are financially protected by the ATOL scheme.
        <span className="mx-2 opacity-40">·</span>
        Company Registration: <strong className="text-black">06450479</strong>
      </div>
    </footer>
  )
}

export default Footer
