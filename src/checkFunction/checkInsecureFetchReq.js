/**
 * Detects insecure HTTP usage (http:// instead of https://) in fetch, axios, and XHR.
 * @param {string} code - Source code to scan.
 * @returns {Object} - Results with issues and recommendations.
 */
export function detectInsecureHttpUsage(code) {
  const result = {
    id: 4,
    name: "Insecure Fetch Requests",
    message: "ok",
    issues: []
  };

  const patterns = [
    {
      tool: "fetch",
      regex: /fetch\s*\(\s*['"`]http:\/\/[^'"`]+['"`]/gi,
      recommendation: "Use HTTPS instead of HTTP for secure communication."
    },
    {
      tool: "axios",
      regex: /axios\.(get|post|put|delete|patch)\s*\(\s*['"`]http:\/\/[^'"`]+['"`]/gi,
      recommendation: "Replace with HTTPS to avoid insecure requests."
    },
    {
      tool: "XMLHttpRequest",
      regex: /\.open\s*\(\s*['"`](GET|POST|PUT|DELETE|PATCH)['"`],\s*['"`]http:\/\/[^'"`]+['"`]/gi,
      recommendation: "Ensure requests are made over HTTPS to prevent data leaks."
    }
  ];

  const lines = code.split("\n");

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.regex.exec(code)) !== null) {
      const codeUpToMatch = code.substring(0, match.index);
      const lineNumber = codeUpToMatch.split("\n").length;
      const lineContent = lines[lineNumber - 1]?.trim() || "";

      result.issues.push({
        type: "Insecure HTTP Usage",
        tool: pattern.tool,
        line: lineNumber,
        context: lineContent,
        snippet: match[0],
        recommendation: pattern.recommendation
      });

      result.message = "notOk";
    }
  }

  return result;
}
