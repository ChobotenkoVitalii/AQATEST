const fs = require('fs');

const FIELDS = ['file_path', 'path', 'pattern', 'glob', 'command', 'notebook_path'];
const ENV_REF = /(^|[\\/\s"'=])\.env(?!\.example)(?![\w-])/i;

let payload = {};
try {
  payload = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const input = payload.tool_input || {};
for (const field of FIELDS) {
  const value = input[field];
  if (typeof value === 'string' && ENV_REF.test(value)) {
    console.error(`Blocked: ${payload.tool_name || 'tool'} touches .env (${field}). .env holds real secrets; use .env.example instead.`);
    process.exit(2);
  }
}
process.exit(0);
