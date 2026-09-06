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

const defaultCategories = [
  { name: "Vêtements & Mode", slug: "vetements-mode", description: "Habits, t-shirts, pantalons et textiles" },
  { name: "Électronique & High-Tech", slug: "electronique-hightech", description: "Smartphones, téléviseurs et objets connectés" },
  { name: "Informatique & Bureautique", slug: "informatique-bureautique", description: "Ordinateurs, écrans et périphériques" },
  { name: "Accessoires & Maroquinerie", slug: "accessoires-maroquinerie", description: "Sacs, montres et bijoux" },
  { name: "Maison & Décoration", slug: "maison-decoration", description: "Meubles, éclairages et articles ménagers" },
  { name: "Chaussures & Sport", slug: "chaussures-sport", description: "Baskets, chaussures et équipements sportifs" },
  { name: "Beauté & Hygiène", slug: "beaute-hygiene", description: "Soins, cosmétiques et parfumerie" },
];

async function seedCategories() {
  console.log("Seeding categories into Neon Postgres...");

  for (const cat of defaultCategories) {
    try {
      await sql`
        INSERT INTO categories (id, name, slug, description, created_at)
        VALUES (gen_random_uuid(), ${cat.name}, ${cat.slug}, ${cat.description}, NOW())
        ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description;
      `;
      console.log(`  ✓ Catégorie ajoutée / mise à jour: ${cat.name}`);
    } catch (err) {
      console.error(`  ❌ Erreur pour ${cat.name}:`, err);
    }
  }

  console.log("✅ Seed des catégories terminé avec succès!");
}

seedCategories();
