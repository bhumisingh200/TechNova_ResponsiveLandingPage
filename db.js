const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const MYSQL_PATH = `"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe"`;
const MYSQL_USER = 'root';
const MYSQL_PASS = 'Bhumi@2006';
const MYSQL_DB = 'technova_db';

function runQuery(sql) {
  const tempFile = path.join(__dirname, `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.sql`);
  
  try {
    fs.writeFileSync(tempFile, sql, 'utf8');
    
    // Command: mysql.exe -u root -pPassword -D technova_db < tempFile
    const cmd = `${MYSQL_PATH} -u ${MYSQL_USER} -p"${MYSQL_PASS}" -D ${MYSQL_DB} < "${tempFile}"`;
    const output = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    
    return output;
  } finally {
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    } catch (e) {
      // Ignore
    }
  }
}

module.exports = {
  runQuery,
  
  queryRows(sql) {
    const output = runQuery(sql);
    if (!output || !output.trim()) return [];
    
    const lines = output.trim().split(/\r?\n/);
    if (lines.length <= 0) return [];
    
    const headers = lines[0].split('\t');
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split('\t');
      const row = {};
      headers.forEach((h, index) => {
        row[h] = parts[index] === 'NULL' ? null : parts[index];
      });
      rows.push(row);
    }
    
    return rows;
  },

  querySingle(sql) {
    const rows = this.queryRows(sql);
    return rows.length > 0 ? rows[0] : null;
  },

  execute(sql) {
    runQuery(sql);
  },
  
  escape(val) {
    if (val === undefined || val === null) return 'NULL';
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'number') return val.toString();
    
    // Escape string
    const escaped = val.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
        case "\0": return "\\0";
        case "\x08": return "\\b";
        case "\x09": return "\\t";
        case "\x0a": return "\\n";
        case "\x0d": return "\\r";
        case "\x1a": return "\\Z";
        case "'": return "''";
        case "\"": return "\\\"";
        case "\\": return "\\\\";
        case "%": return "\\%";
        default: return char;
      }
    });
    return `'${escaped}'`;
  }
};
