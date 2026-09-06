const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const match = envContent.match(/DATABASE_URL=["']?([^"'\n\r]+)["']?/);
    if (match) {
      databaseUrl = match[1];
    }
  }
}

if (!databaseUrl) {
  console.error("DATABASE_URL not found in environment or .env file!");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function runMigration() {
  console.log("Applying database schema migration to Neon Postgres...");

  try {
    // 1. Update products table
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS sub_category_id UUID REFERENCES categories(id) ON DELETE SET NULL;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS vat_rate NUMERIC(5, 2) DEFAULT 20.00 NOT NULL;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS weight NUMERIC(10, 2);`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions JSONB;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS qr_code_url TEXT;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;`;

    // 2. Update product_variants table
    await sql`ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;`;

    // 3. Ensure product_images table and columns exist
    await sql`
      CREATE TABLE IF NOT EXISTS product_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        key TEXT,
        is_primary BOOLEAN DEFAULT false NOT NULL,
        position INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT now() NOT NULL
      );
    `;

    await sql`ALTER TABLE product_images ADD COLUMN IF NOT EXISTS key TEXT;`;
    await sql`ALTER TABLE product_images ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false NOT NULL;`;
    await sql`ALTER TABLE product_images ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0 NOT NULL;`;
    await sql`ALTER TABLE product_images ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT now() NOT NULL;`;

    // 4. Create Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_variants_deleted_at ON product_variants(deleted_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON product_images(is_primary);`;

    console.log("✅ All columns & indexes successfully added to Neon Postgres!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
