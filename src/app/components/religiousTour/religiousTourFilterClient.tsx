// "use client";

// import { useState, useMemo } from "react";
// import ReligiousTourFilters from "./religiousTourFilters";
// import type { TourFilterType } from "./religiousTourFilters";
// import ReligiousTourGrid from "./religiousTourGrid";

// const filterLabel: Record<TourFilterType, string> = {
//   all: "tours",
//   hajj: "Hajj packages",
//   umrah: "Umrah packages",
//   other: "religious tours",
// };

// export default function ReligiousTourFiltersClient({ initialTours }) {
//   const [activeFilter, setActiveFilter] = useState<TourFilterType>("all");

//   const filteredTours = useMemo(() => {
//     if (activeFilter === "all") return initialTours;
//     return initialTours.filter((t) => t.category === activeFilter);
//   }, [activeFilter, initialTours]);

//   return (
//     <section className="relative py-16 px-6 overflow-hidden bg-linear-to-b from-background to-background/60">
//       {/* Ambient blobs */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
//         <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
//       </div>

//       <div className="relative max-w-7xl mx-auto space-y-10">
//         {/* Filter buttons */}
//         <ReligiousTourFilters active={activeFilter} onChange={setActiveFilter} />

//         {/* Results count */}
//         <p className="text-sm text-muted-foreground text-center">
//           Showing{" "}
//           <span className="font-semibold text-foreground">
//             {filteredTours.length}
//           </span>{" "}
//           {filteredTours.length === 1
//             ? filterLabel[activeFilter].replace(/s$/, "")
//             : filterLabel[activeFilter]}
//         </p>

//         {/* Cards */}
//         <ReligiousTourGrid tours={filteredTours} />
//       </div>
//     </section>
//   );
// }


"use client";

import { useState, useMemo } from "react";
import ReligiousTourFilters from "./religiousTourFilters";
import type { TourFilterType } from "./religiousTourFilters";
import ReligiousTourGrid from "./religiousTourGrid";

const filterLabel: Record<TourFilterType, string> = {
  all: "tours",
  hajj: "Hajj packages",
  umrah: "Umrah packages",
  other: "religious tours",
};

export default function ReligiousTourFiltersClient({ initialTours }) {
  const [activeFilter, setActiveFilter] = useState<TourFilterType>("all");

  const filteredTours = useMemo(() => {
    if (activeFilter === "all") return initialTours;
    return initialTours.filter((t) => t.category === activeFilter);
  }, [activeFilter, initialTours]);

  return (
    <section className="relative pb-16 px-6 bg-gradient-to-b from-background to-background/60 overflow-hidden">

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-10">

        {/* 🔥 Sticky Filters */}
        <div className="sticky top-24 z-20">
          <div className="backdrop-blur-xl bg-background/70 border border-border rounded-2xl p-4 shadow-sm">
            <ReligiousTourFilters
              active={activeFilter}
              onChange={setActiveFilter}
            />
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground text-center">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredTours.length}
          </span>{" "}
          {filteredTours.length === 1
            ? filterLabel[activeFilter].replace(/s$/, "")
            : filterLabel[activeFilter]}
        </p>

        {/* Grid */}
        <ReligiousTourGrid tours={filteredTours} />
      </div>
    </section>
  );
}