#!/usr/bin/env tsx
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const args = process.argv.slice(2);
const emailArg = args[0] || process.env.ADMIN_EMAIL || 'admin@ahsanailabs.com';
const passwordArg = args[1] || process.env.ADMIN_PASSWORD || 'admin_password_123';
const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME || 'AHSAN_AI_LABS';

console.log('========================================================');
console.log('    🔐 AHSAN AI LABS — MongoDB Admin Credential Tool');
console.log('========================================================');
console.log(`--> Target Email:    ${emailArg}`);
console.log(`--> Target Password: ${passwordArg}`);

async function main() {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(passwordArg, salt);

  if (uri) {
    try {
      console.log(`--> Connecting to MongoDB: ${dbName}...`);
      const client = new MongoClient(uri, { connectTimeoutMS: 5000 });
      await client.connect();
      const db = client.db(dbName);
      const adminsCol = db.collection('admins');

      await adminsCol.updateOne(
        { $or: [{ _id: 'admin_primary' as any }, { email: emailArg }] as any },
        {
          $set: {
            _id: 'admin_primary',
            email: emailArg,
            name: 'Ahsan Ali (Super Admin)',
            role: 'SUPER_ADMIN',
            passwordHash,
            updatedAt: new Date().toISOString()
          }
        },
        { upsert: true }
      );

      await client.close();
      console.log(' ✅ Admin credentials successfully updated in MongoDB!');
    } catch (err: any) {
      console.warn(' ⚠️ MongoDB update failed:', err?.message || err);
    }
  } else {
    console.log(' ℹ️ MONGODB_URI not provided. Admin credentials active via .env configuration.');
  }

  console.log(` ✅ Password hash generated: ${passwordHash.substring(0, 15)}...`);
  console.log('========================================================');
  console.log(' You can now login on the Admin page with:');
  console.log(`  Email:    ${emailArg}`);
  console.log(`  Password: ${passwordArg}`);
  console.log('========================================================');
}

main();
