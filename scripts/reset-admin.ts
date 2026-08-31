#!/usr/bin/env tsx
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const args = process.argv.slice(2);
const emailArg = args[0] || process.env.ADMIN_EMAIL || 'admin@ahsanailabs.com';
const passwordArg = args[1] || process.env.ADMIN_PASSWORD || 'Ahsan&ali12:@';

console.log('========================================================');
console.log('    🔐 AHSAN AI LABS — Admin Credential Tool');
console.log('========================================================');
console.log(`--> Target Email:    ${emailArg}`);
console.log(`--> Target Password: ${passwordArg}`);

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbData: any = { admins: [] };
if (fs.existsSync(DB_FILE)) {
  try {
    dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    console.warn('Could not parse existing db.json, creating clean structure');
  }
}

if (!Array.isArray(dbData.admins) || dbData.admins.length === 0) {
  dbData.admins = [
    {
      _id: 'admin_primary',
      email: emailArg,
      name: 'Ahsan Ali (Super Admin)',
      role: 'SUPER_ADMIN',
      passwordHash: '',
      lastLogin: new Date().toISOString()
    }
  ];
}

const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync(passwordArg, salt);

// Update primary admin
dbData.admins[0].email = emailArg;
dbData.admins[0].passwordHash = passwordHash;
dbData.admins[0].updatedAt = new Date().toISOString();

fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');

console.log(' ✅ Admin credentials successfully updated in data/db.json!');
console.log(` ✅ Password hash generated: ${passwordHash.substring(0, 15)}...`);
console.log('========================================================');
console.log(' You can now login on the Admin page with:');
console.log(`  Email:    ${emailArg}`);
console.log(`  Password: ${passwordArg}`);
console.log('========================================================');
