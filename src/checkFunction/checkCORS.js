/**
 * Scans code for open or insecure CORS configurations.
 * Looks for wildcard (*) in Access-Control-Allow-Origin or similar configs.
 * @param {string} code - The code block to scan.
 * @returns {Object} - Scan result with detected CORS policy issues.
 */
export function detectOpenCorsPolicy(code) {
  const result = {
    id: 3,
    name: 'CORS',
    message: 'ok',
    issues: []
  };

  // Regex patterns to detect insecure CORS configurations
  const regexes = [
    {
      regex: /access-control-allow-origin\s*[:=]\s*['"`]\*['"`]/gi,
      framework: 'Manual Header'
    },
    {
      regex: /origin\s*:\s*['"`]\*['"`]/gi,
      framework: 'Express.js'
    },
    {
      regex: /fastify\.register\s*\(\s*require\(['"`]@fastify\/cors['"`]\),\s*\{[^}]*origin\s*:\s*['"`]\*['"`]/gi,
      framework: 'Fastify'
    },
    {
      regex: /cors\s*\(\s*\{[^}]*origin\s*:\s*['"`]\*['"`]/gi,
      framework: 'Generic CORS Setup'
    }
  ];

  for (const { regex, framework } of regexes) {
    let match;
    while ((match = regex.exec(code)) !== null) {
      const beforeMatch = code.slice(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      result.issues.push({
        type: 'Open CORS Policy',
        framework,
        match: match[0],
        index: match.index,
        line: lineNumber,
        recommendation: 'Avoid using "*" in CORS origin. Specify allowed origins explicitly.'
      });
      result.message = 'notOk';
    }
  }

  return result;
}
