  import { NextResponse } from "next/server";
  import { connectDB } from "@/lib/db";
  import Offer from "@/models/offer";
  import { verifyAdmin } from "@/middlewares/verifyAdmin";
  import { uploadSingleImage, uploadMultipleImages } from "@/lib/cloudinary";

  // ─── Helper: map DB document → new frontend Offer shape ───────────────────────
  function mapOfferToFrontend(o) {
    // The old model stores `amount` as the price.
    // The new frontend expects originalPrice + discountedPrice + discount (%).
    const originalPrice = o.amount ?? 0;
    const discountPercent = o.discount ?? 0; // new field we added to the model
    const discountedPrice =
      discountPercent > 0
        ? Math.round(originalPrice * (1 - discountPercent / 100))
        : originalPrice;

    return {
      _id: o._id,
      title: o.title,
      destination: o.destination || "",
      // Old model: "Flight" | "Hotel" | "Package"  →  new: "flight" | "hotel" | "package"
      category: (o.type || "package").toLowerCase(),
      // Use the first category tag, or fall back to a generic label
      tag: Array.isArray(o.category) && o.category.length > 0 ? o.category[0] : "Offer",
      discount: discountPercent,
      originalPrice,
      discountedPrice,
      currency: o.currency || "GBP",
      // dateTo is the expiry date; fall back to dateFrom if dateTo is absent
      validUntil: o.dateTo ? o.dateTo.toISOString() : (o.dateFrom ? o.dateFrom.toISOString() : null),
      description: o.description || "",
      image: Array.isArray(o.images) && o.images.length > 0 ? o.images[0] : "/placeholder.jpg",
      featured: o.showOnHome ?? false,
      // Pass through extra fields the detail page may need
      slug: o.slug,
      fareType: o.fareType,
      airline: o.airline,
      journeyType: o.journeyType,
      cabinClass: o.cabinClass,
      hotelName: o.hotelName,
      rating: o.rating,
      images: o.images,
      active: o.active,
    };
  }

  // ─── POST — create offer (admin only) ─────────────────────────────────────────
  export async function POST(req) {
    try {
      const admin = await verifyAdmin(req);
      if (!admin) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });

      await connectDB();
      const formData = await req.formData();
      const data = Object.fromEntries(formData);
      const files = formData.getAll("images");
      let imageUrls = [];

      if (files && files.length > 0) {
        if (files.length === 1) {
          const buffer = Buffer.from(await files[0].arrayBuffer());
          const url = await uploadSingleImage(buffer, "offers");
          imageUrls.push(url);
        } else {
          imageUrls = await uploadMultipleImages(files, "offers");
        }
      }

      if (data.category) {
        data.category = Array.isArray(data.category) ? data.category : [data.category];
      } else {
        data.category = [];
      }

      // Coerce discount to number if present
      if (data.discount !== undefined) {
        data.discount = Number(data.discount);
      }

      const offer = await Offer.create({ ...data, images: imageUrls });
      return NextResponse.json({ success: true, offer }, { status: 201 });
    } catch (error) {
      console.error("Offer POST Error:", error);
      return NextResponse.json({ success: false, error: "Failed to create offer" }, { status: 500 });
    }
  }

  // ─── PUT — update offer (admin only) ──────────────────────────────────────────
  export async function PUT(req) {
    try {
      const admin = await verifyAdmin(req);
      if (!admin) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });

      await connectDB();
      const formData = await req.formData();
      const data = Object.fromEntries(formData);
      const { _id } = data;

      if (!_id) return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });

      const files = formData.getAll("images");
      let newImageUrls = [];
      if (files && files.length > 0) newImageUrls = await uploadMultipleImages(files, "offers");

      let existingImages = [];
      if (data.existingImages)
        existingImages = Array.isArray(data.existingImages)
          ? data.existingImages
          : [data.existingImages];

      const finalImages = [...existingImages, ...newImageUrls];
      delete data._id;
      delete data.images;
      delete data.existingImages;

      if (data.category) {
        data.category = Array.isArray(data.category) ? data.category : [data.category];
      } else {
        data.category = [];
      }

      if (data.discount !== undefined) {
        data.discount = Number(data.discount);
      }

      const updatedOffer = await Offer.findByIdAndUpdate(
        _id,
        { ...data, images: finalImages },
        { new: true, runValidators: true }
      );

      if (!updatedOffer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
      return NextResponse.json({ success: true, offer: updatedOffer }, { status: 200 });
    } catch (error) {
      console.error("Offer PUT Error:", error);
      return NextResponse.json({ success: false, error: "Failed to update offer" }, { status: 500 });
    }
  }

  // ─── GET — fetch offers (public) ──────────────────────────────────────────────
  export async function GET(req) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const slug = searchParams.get("slug");
      const frontend = searchParams.get("frontend"); // ?frontend=1 → mapped shape

      // Single offer by slug
      if (slug) {
        const offer = await Offer.findOne({ slug });
        if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        const data = frontend ? mapOfferToFrontend(offer) : offer;
        return NextResponse.json({ success: true, offer: data }, { status: 200 });
      }

      // All offers — map to frontend shape when ?frontend=1
      const offers = await Offer.find({ active: true }).sort({ createdAt: -1 });
      const data = frontend ? offers.map(mapOfferToFrontend) : offers;
      return NextResponse.json({ success: true, offers: data });
    } catch (error) {
      console.error("Offer GET Error:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch offers" }, { status: 500 });
    }
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────────
  export async function DELETE(req) {
    try {
      const admin = await verifyAdmin(req);
      if (!admin) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });

      await connectDB();
      const { _id } = await req.json();
      if (!_id) return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });

      const deletedOffer = await Offer.findByIdAndDelete(_id);
      if (!deletedOffer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Offer deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Offer DELETE Error:", error);
      return NextResponse.json({ success: false, error: "Failed to delete offer" }, { status: 500 });
    }
  }

  // ─── PATCH — toggle active ────────────────────────────────────────────────────
  export async function PATCH(req) {
    try {
      const admin = await verifyAdmin(req);
      if (!admin) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });

      await connectDB();
      const { _id, active } = await req.json();
      if (!_id) return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });

      const updatedOffer = await Offer.findByIdAndUpdate(_id, { active }, { new: true });
      if (!updatedOffer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });

      return NextResponse.json(
        { success: true, message: `Offer ${active ? "activated" : "deactivated"} successfully`, offer: updatedOffer },
        { status: 200 }
      );
    } catch (error) {
      console.error("Offer PATCH Error:", error);
      return NextResponse.json({ success: false, error: "Failed to update offer status" }, { status: 500 });
    }
  }
