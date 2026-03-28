import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootDir = path.join(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const templatePath = path.join(rootDir, 'prisma/schema.prisma.template');
const schemaPath = path.join(rootDir, 'prisma/schema.prisma');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

const usePostgres = process.env.USE_POSTGRES === 'true';
const provider = usePostgres ? 'postgresql' : 'sqlite';
const dbUrl =
  provider === 'sqlite'
    ? process.env.DATABASE_URL || 'file:./dev.db'
    : process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/whose_bean';

const template = fs.readFileSync(templatePath, 'utf-8');
const schema = template
  .replace(/\{\{PROVIDER\}\}/g, provider)
  .replace(/\{\{DATABASE_URL\}\}/g, dbUrl);
fs.writeFileSync(schemaPath, schema);

console.log(`Generated schema.prisma with provider = "${provider}"`);
