const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

// Check env variables
const MONGODB_URI = process.env.MONGODB_URI;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in the environment.");
  process.exit(1);
}

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("Error: Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing.");
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// Define Mongoose Schema matching the DB fields
const ProductSchema = new mongoose.Schema({
  name: String,
  image: String,
  backImage: String,
  closeupImage: String,
  fitImage: String,
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function migrate() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully.");

  const products = await Product.find({});
  console.log(`Found ${products.length} products total in the database.`);

  let checkedCount = 0;
  let migratedCount = 0;

  for (const product of products) {
    let updated = false;
    const imageFields = ["image", "backImage", "closeupImage", "fitImage"];

    checkedCount++;
    let hasBase64 = false;
    for (const field of imageFields) {
      const val = product[field];
      if (val && (val.startsWith("data:image/") || val.startsWith("data:application/octet-stream"))) {
        hasBase64 = true;
      }
    }

    if (hasBase64) {
      console.log(`[${checkedCount}/${products.length}] Migrating product: "${product.name}" (ID: ${product._id})`);
      for (const field of imageFields) {
        const val = product[field];
        if (val && (val.startsWith("data:image/") || val.startsWith("data:application/octet-stream"))) {
          console.log(`  - Uploading ${field} base64 string to Cloudinary...`);
          try {
            const res = await cloudinary.uploader.upload(val, {
              folder: "90drip/products",
              resource_type: "auto",
            });
            product[field] = res.secure_url;
            updated = true;
            console.log(`    Successfully uploaded. Hosted URL: ${res.secure_url}`);
          } catch (err) {
            console.error(`    Failed to upload ${field}:`, err.message);
          }
        }
      }
    }

    if (updated) {
      await product.save();
      migratedCount++;
      console.log(`  Saved product "${product.name}" with hosted Cloudinary URLs.\n`);
    }
  }

  console.log(`Migration summary: Checked ${checkedCount} products. Successfully migrated ${migratedCount} products.`);
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
