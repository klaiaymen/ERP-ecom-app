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

async function setAdminRole() {
  const emails = ["ademklai244@gmail.com", "klaiaymen58@gmail.com"];

  for (const email of emails) {
    console.log(`Setting role 'admin' for user email: ${email}...`);

    try {
      const result = await sql`
        UPDATE users
        SET role = 'admin', updated_at = NOW()
        WHERE LOWER(email) = LOWER(${email})
        RETURNING id, clerk_user_id, email, role, first_name, last_name;
      `;

      if (result.length === 0) {
        console.log(`⚠️ User with email '${email}' not yet in DB users table. Will be synced as admin on first login.`);
      } else {
        console.log(`✅ Success! User updated in Neon Postgres:`, result[0]);
      }
    } catch (error) {
      console.error(`❌ Error updating user role for ${email}:`, error);
    }
  }
}

setAdminRole();
