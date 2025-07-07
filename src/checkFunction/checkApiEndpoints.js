/**
 * Scans code for exposed API calls to sensitive routes.
 * Returns detected issues in a structured result.
 * @param {string} code - The code block to scan.
 * @returns {Object} - Scan result with detected issues.
 */
export function scanCodeForSensitiveRoutes(code) {
  const riskyKeywords = ['admin', 'debug', 'internal', 'secret', 'config', 'token', 'delete'];

  const result = {
    id: 1,
    name: 'API Endpoint',
    message: 'ok',
    issues: []
  };

  const patterns = [
    {
      type: 'server-route',
      regex: /\b(app|router|fastify|server)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
      extractRoute: (m) => m[3],
      detectAuth: () => false // Server route declaration doesn't include auth in this context
    },
    {
      type: 'decorator-route',
      regex: /@(Get|Post|Put|Delete|Patch)\(\s*['"`]([^'"`]+)['"`]\s*\)/gi,
      extractRoute: (m) => m[2],
      detectAuth: () => false
    },
    {
      type: 'client-fetch',
      regex: /fetch\s*\(\s*(['"`])([^'"`]+)\1\s*,\s*({[\s\S]*?})\s*\)/gi,
      extractRoute: (m) => m[2],
      detectAuth: (config) => /['"`]Authorization['"`]\s*:\s*['"`]Bearer\s+[^'"`]+['"`]/i.test(config),
      extractConfig: (m) => m[3]
    },
    {
      type: 'client-axios',
      regex: /\baxios\.(get|post|put|delete)\s*\(\s*(['"`])([^'"`]+)\2\s*,\s*({[\s\S]*?})?\s*\)/gi,
      extractRoute: (m) => m[3],
      detectAuth: (config) => /['"`]Authorization['"`]\s*:\s*['"`]Bearer\s+[^'"`]+['"`]/i.test(config),
      extractConfig: (m) => m[4] || ''
    }
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.regex.exec(code)) !== null) {
      const route = pattern.extractRoute(match);
      const lowerRoute = route.toLowerCase();
      const keyword = riskyKeywords.find(k => lowerRoute.includes(k));

      if (keyword) {
        // Compute line number
        const lineNumber = code.slice(0, match.index).split('\n').length;

        // Determine if protected (only applies to client patterns)
        const configString = pattern.extractConfig ? pattern.extractConfig(match) : '';
        const isProtected = pattern.detectAuth(configString);

        result.issues.push({
          type: pattern.type,
          route,
          keyword,
          context: match[0],
          index: match.index,
          line: lineNumber,
          isProtected,
          fix: isProtected ? null : suggestProtection(route)
        });

        result.message = 'notOk';
      }
    }
  }

  return result;
}

/**
 * Generates a suggestion for protecting sensitive routes.
 * @param {string} route - The route to protect.
 * @returns {Object} - Suggestion details.
 */
function suggestProtection(route) {
  return {
    suggestion: `The route '${route}' is sensitive and should be protected with authentication.`,
    recommendation: [
      `- Add an 'Authorization' header with a token.`,
      `- Use middleware to protect this route on the backend.`,
      `- Hide or disable this route in production environments.`
    ]
  };
}
