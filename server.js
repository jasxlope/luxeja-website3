const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "";
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use(express.static(__dirname));

let databaseReady = false;

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      databaseReady = true;
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
} else {
  console.warn("MONGODB_URI not set. API write routes will be unavailable.");
}

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    source: {
      type: String,
      default: "gift-popup",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    databaseReady,
  });
});

app.get("/api/products", async (_req, res) => {
  if (!databaseReady) {
    res.status(503).json({ error: "Database unavailable." });
    return;
  }

  try {
    const products = await Product.find().lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch products." });
  }
});

app.post("/api/subscribers", async (req, res) => {
  if (!databaseReady) {
    res.status(503).json({
      error: "Database unavailable. Add MONGODB_URI to enable subscriptions.",
    });
    return;
  }

  const email = String(req.body?.email || "").trim().toLowerCase();
  const source = String(req.body?.source || "gift-popup").trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailIsValid) {
    res.status(400).json({ error: "Please provide a valid email address." });
    return;
  }

  try {
    const existingSubscriber = await Subscriber.findOne({ email }).lean();

    if (existingSubscriber) {
      res.json({ message: "You're already on the Luxeja list." });
      return;
    }

    await Subscriber.create({ email, source });
    res.status(201).json({ message: "You're on the Luxeja list for gift updates." });
  } catch (error) {
    res.status(500).json({ error: "Unable to save subscriber right now." });
  }
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    next();
    return;
  }

  const requestedFile = path.join(__dirname, req.path);
  res.sendFile(requestedFile, (error) => {
    if (error) {
      res.sendFile(path.join(__dirname, "index.html"));
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
