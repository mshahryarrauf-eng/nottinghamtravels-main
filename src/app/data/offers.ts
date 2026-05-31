// ─────────────────────────────────────────────
//  data/offers.ts
//  Dummy data — replace fetch() call with MongoDB
//  query later. Shape matches a MongoDB document.
// ─────────────────────────────────────────────

export type Offer = {
  _id: string
  title: string
  slug : string
  destination: string
  category: "flight" | "hotel" | "package"
  tag: string          // e.g. "Limited Time", "Best Seller"
  discount: number     // percentage
  originalPrice: number
  discountedPrice: number
  currency: string
  validUntil: string   // ISO date string
  description: string
  image: string        // public image path or URL
  featured: boolean
}
