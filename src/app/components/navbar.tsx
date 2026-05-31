
// "use client";

// import React, { useRef, useState } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";

// const links = [
//   { name: "Home", href: "/" },
//   { name: "About", href: "/about-us" },
//   { name: "Offers", href: "/special-offers" },
//   { name: "Religious Tours", href: "/religious-tone" },
//   { name: "Special Query", href: "/tailor-made-query" },
// ];

// export default function Navbar() {
//   const navbarRef = useRef<HTMLDivElement>(null);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [cursor, setCursor] = useState({ x: 0, y: 0 });
//   const [hovered, setHovered] = useState(false);

//   const handleMouseMove = (e: React.MouseEvent) => {
//     const rect = navbarRef.current?.getBoundingClientRect();
//     if (!rect) return;
//     setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
//   };

//   return (
//     <nav
//       ref={navbarRef}
//       onMouseMove={handleMouseMove}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50"
//     >
//       {/* Glow Spotlight */}
//       <motion.div
//         className="absolute inset-0 rounded-2xl pointer-events-none"
//         style={{
//           background: `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, rgba(255,255,255,0.15), transparent 40%)`,
//           filter: "blur(60px)",
//         }}
//         animate={{ opacity: hovered ? 1 : 0 }}
//       />

//       {/* Glass Navbar */}
//       <div className="relative flex items-center justify-between px-6 py-4 rounded-2xl 
//         bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">

//         {/* Logo */}
//         <Link href="/" className="z-10">
//           <img src="/nottingham.png" className="w-12 h-12 object-contain" />
//         </Link>

//         {/* Center Links */}
//         <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8">
//           {links.map((link) => (
//             <NavItem key={link.name} {...link} />
//           ))}
//         </div>

//         {/* CTA */}
//         {/* CTA Replacement */}
// <div className="hidden md:block">
//   <Link href="/tailor-made-query">
//     <button className="relative px-5 py-2 text-sm font-medium rounded-full overflow-hidden group">
      
//       {/* Gradient Background */}
//       <span className="absolute inset-0 bg-green-500 transition-transform duration-300 group-hover:scale-110" />
      
    
//       {/* Text */}
//       <span className="relative text-white">
//         Plan Your Trip
//       </span>
//     </button>
//   </Link>
// </div>

//         {/* Hamburger */}
//         <button
//           onClick={() => setMenuOpen(!menuOpen)}
//           className="md:hidden z-20"
//         >
//           <div className="space-y-1">
//             <motion.span
//               animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
//               className="block w-6 h-0.5 bg-black"
//             />
//             <motion.span
//               animate={{ opacity: menuOpen ? 0 : 1 }}
//               className="block w-6 h-0.5 bg-black"
//             />
//             <motion.span
//               animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
//               className="block w-6 h-0.5 bg-black"
//             />
//           </div>
//         </button>
//       </div>

//       {/* Fullscreen Mobile Menu */}
//       <AnimatePresence>
//         {menuOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center gap-8 text-2xl"
//           >
//             {links.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 onClick={() => setMenuOpen(false)}
//                 className="hover:opacity-60 transition"
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }

// /* Animated Nav Item */
// function NavItem({ name, href }: { name: string; href: string }) {
//   return (
//     <Link href={href} className="relative group text-sm font-medium">
//       {name}

//       {/* Animated underline */}
//       <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />

//       {/* Glow */}
//       <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 blur-md bg-white/40 -z-10 transition" />
//     </Link>
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
    <>
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
        <div className="relative flex items-center justify-between px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg">

          {/* Logo */}
          <Link href="/" className="z-10">
            <img src="/nottingham.png" className="w-12 h-12 object-contain" alt="Logo" />
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8">
            {links.map((link) => (
              <NavItem key={link.name} {...link} />
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="/tailor-made-query">
              <button className="relative px-5 py-2 text-sm font-medium rounded-full overflow-hidden group">
                <span className="absolute inset-0 bg-green-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative text-white">Plan Your Trip</span>
              </button>
            </Link>
          </div>

          {/* Hamburger — must be z-[60] to sit above the mobile overlay */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden z-[60] relative p-1"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-0.5 bg-black"
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-0.5 bg-black my-1"
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-0.5 bg-black"
            />
          </button>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu — rendered outside <nav> so z-index stacks cleanly */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center gap-8 z-40 md:hidden"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-medium hover:opacity-60 transition-opacity"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            {/* Mobile CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.06 }}
            >
              <Link href="/tailor-made-query" onClick={() => setMenuOpen(false)}>
                <button className="mt-4 px-8 py-3 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors">
                  Plan Your Trip
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ name, href }: { name: string; href: string }) {
  return (
    <Link href={href} className="relative group text-sm font-medium">
      {name}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
      <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 blur-md bg-white/40 -z-10 transition" />
    </Link>
  );
}