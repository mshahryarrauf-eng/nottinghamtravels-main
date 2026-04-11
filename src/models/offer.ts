import mongoose, {
  Schema,
  model,
  models,
  Model,
  InferSchemaType,
} from "mongoose";
import slugify from "slugify";

/**
 * 1. Define schema with proper typing
 */
const OfferSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Flight", "Hotel", "Package"],
      required: true,
    },

    fareType: {
      type: String,
      enum: ["Per Person", "Total"],
      default: "Per Person",
    },

    category: {
      type: [String],
      default: [],
    },

    amount: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    currency: {
      type: String,
      default: "GBP",
    },

    active: {
      type: Boolean,
      default: true,
    },

    showOnHome: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    airline: String,
    destination: String,

    journeyType: {
      type: String,
      enum: ["One Way", "Two Way"],
    },

    dateFrom: Date,
    dateTo: Date,

    cabinClass: {
      type: String,
      enum: ["Economy", "Premium Economy", "Business", "First"],
    },

    description: String,

    images: {
      type: [String],
      default: [],
    },

    hotelName: String,

    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * 2. Infer Type from Schema
 */
export type IOffer = InferSchemaType<typeof OfferSchema>;

/**
 * 3. Fix `this` typing inside middleware
 */
interface OfferDocument extends IOffer, mongoose.Document {}

OfferSchema.pre<OfferDocument>("validate", async function (next) {
  if (!this.slug) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await mongoose.models.Offer?.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  next();
});

/**
 * 4. Strongly typed model (THIS FIXES YOUR ERROR)
 */
const Offer: Model<IOffer> =
  (models.Offer as Model<IOffer>) ||
  model<IOffer>("Offer", OfferSchema);

export default Offer;