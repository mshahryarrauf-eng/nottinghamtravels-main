// "use client";

// import React, { useRef, useState } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// const links = [
//   { name: "Home", href: "/" },
//   { name: "About", href: "/about-us" },
//   { name: "Offers", href: "/special-offers" },
//   { name: "Religious Tours", href: "/religious-tone" },
//   { name: "Special Query", href: "/tailor-made-query" },
// ];

// export default function Navbar() {
//   const navbarRef = useRef<HTMLDivElement>(null);
//   const [cursor, setCursor] = useState({ x: 0, y: 0 });
//   const [hovered, setHovered] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleMouseMove = (e: React.MouseEvent) => {
//     const rect = navbarRef.current?.getBoundingClientRect();
//     if (!rect) return;
//     setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
//   };

//   return (
//     <nav
//       ref={navbarRef}
//       className="fixed top-0 left-0 w-full bg-white border-gray-200 z-50"
//       onMouseMove={handleMouseMove}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Spotlight */}
//       <motion.div
//         className="pointer-events-none absolute top-0 left-0 w-full h-full"
//         style={{
//           background: `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, rgba(173,216,230,0.25) 0%, rgba(173,216,230,0) 15%)`,
//           filter: "blur(40px)",
//         }}
//         animate={{ opacity: hovered ? 1 : 0 }}
//         transition={{ duration: 0.15 }}
//       />

//       <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-10">
//         {/* Logo */}
//         <Link href="/">
//           <img src="/nottingham.png" width={70} height={70} alt="Logo" />
//         </Link>

//         {/* Desktop Links */}
//         <div className="hidden md:flex  items-center gap-10 text-sm font-bold text-gray-700">
//           {links.map((link) => (
//             <MagneticLink key={link.name} href={link.href}>
//               {link.name}
//             </MagneticLink>
//           ))}
//         </div>

//         {/* Mobile Hamburger */}
//         {/* Animated Hamburger */}
// <button
//   className="md:hidden relative w-8 h-8 flex items-center justify-center"
//   onClick={() => setMenuOpen(!menuOpen)}
// >
//   <motion.span
//     className="absolute w-6 h-0.5 bg-black"
//     animate={{
//       rotate: menuOpen ? 45 : 0,
//       y: menuOpen ? 0 : -6,
//     }}
//     transition={{ duration: 0.3 }}
//   />
//   <motion.span
//     className="absolute w-6 h-0.5 bg-black"
//     animate={{
//       opacity: menuOpen ? 0 : 1,
//     }}
//     transition={{ duration: 0.2 }}
//   />
//   <motion.span
//     className="absolute w-6 h-0.5 bg-black"
//     animate={{
//       rotate: menuOpen ? -45 : 0,
//       y: menuOpen ? 0 : 6,
//     }}
//     transition={{ duration: 0.3 }}
//   />
// </button>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {menuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="md:hidden bg-white/90 backdrop-blur-xl px-6 pb-6"
//           >
//             <div className="flex flex-col gap-4 text-gray-800 font-medium">
//               {links.map((link) => (
//                 <Link
//                   key={link.name}
//                   href={link.href}
//                   onClick={() => setMenuOpen(false)}
//                   className="py-2 border-b border-gray-200"
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }

// /* Magnetic Link (Desktop Only Feel) */
// function MagneticLink({
//   children,
//   href,
// }: {
//   children: React.ReactNode;
//   href: string;
// }) {
//   const ref = useRef<HTMLAnchorElement>(null);

//   const x = useMotionValue(0);
//   const y = useMotionValue(0);

//   const spring = { stiffness: 150, damping: 15, mass: 0.1 };

//   const springX = useSpring(x, spring);
//   const springY = useSpring(y, spring);

//   const handleMouseMove = (e: React.MouseEvent) => {
//     const rect = ref.current?.getBoundingClientRect();
//     if (!rect) return;

//     const offsetX = e.clientX - (rect.left + rect.width / 2);
//     const offsetY = e.clientY - (rect.top + rect.height / 2);

//     const strength = 0.25;
//     x.set(offsetX * strength);
//     y.set(offsetY * strength);
//   };

//   const handleMouseLeave = () => {
//     x.set(0);
//     y.set(0);
//   };

//   return (
//     <motion.div
//       style={{ x: springX, y: springY }}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       whileHover={{ scale: 1.08 }}
//       className="relative"
//     >
//       <Link
//         ref={ref}
//         href={href}
//         className="inline-block px-4 py-2 hover:text-black transition"
//       >
//         {children}
//       </Link>
//     </motion.div>
//   );
// }

"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about-us" },
  { name: "Offers", href: "/special-offers" },
  { name: "Religious Tours", href: "/religious-tone" },
  { name: "Special Query", href: "/tailor-made-query" },
];

export default function Navbar() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = navbarRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <nav
      ref={navbarRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50"
    >
      {/* Glow Spotlight */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, rgba(255,255,255,0.15), transparent 40%)`,
          filter: "blur(60px)",
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
      />

      {/* Glass Navbar */}
      <div className="relative flex items-center justify-between px-6 py-4 rounded-2xl 
        bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">

        {/* Logo */}
        <Link href="/" className="z-10">
          <img src="/nottingham.png" className="w-12 h-12 object-contain" />
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8">
          {links.map((link) => (
            <NavItem key={link.name} {...link} />
          ))}
        </div>

        {/* CTA */}
        {/* CTA Replacement */}
<div className="hidden md:block">
  <Link href="/tailor-made-query">
    <button className="relative px-5 py-2 text-sm font-medium rounded-full overflow-hidden group">
      
      {/* Gradient Background */}
      <span className="absolute inset-0 bg-green-500 transition-transform duration-300 group-hover:scale-110" />
      
    
      {/* Text */}
      <span className="relative text-white">
        Plan Your Trip
      </span>
    </button>
  </Link>
</div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden z-20"
        >
          <div className="space-y-1">
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
              className="block w-6 h-0.5 bg-black"
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              className="block w-6 h-0.5 bg-black"
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
              className="block w-6 h-0.5 bg-black"
            />
          </div>
        </button>
      </div>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center gap-8 text-2xl"
          >
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="hover:opacity-60 transition"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* Animated Nav Item */
function NavItem({ name, href }: { name: string; href: string }) {
  return (
    <Link href={href} className="relative group text-sm font-medium">
      {name}

      {/* Animated underline */}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />

      {/* Glow */}
      <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 blur-md bg-white/40 -z-10 transition" />
    </Link>
  );
}