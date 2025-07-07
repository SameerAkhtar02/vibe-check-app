/**
 * Scan code for exposed API keys and secrets
 * @param {string} code - The source code to analyze
 * @returns {Object} - Scan results with found keys and remediation advice
 */
export function scanForExposedApiKeys(code) {
  const patterns = [
    {
      type: "Generic API Key",
      regex: /(['"`])(api[-_]?key|apikey)(['"`])(\s*[:=]\s*)(['"`])([a-zA-Z0-9_\-]{16,64})(['"`])/gi,
      severity: "high"
    },
    {
      type: "Google API Key",
      regex: /AIza[0-9A-Za-z\\-_]{35}/g,
      severity: "high"
    },
    {
      type: "AWS Access Key",
      regex: /(AKIA[0-9A-Z]{16})/g,
      severity: "critical"
    },
    {
      type: "AWS Secret Key",
      regex: /(['"`])[a-zA-Z0-9/+]{40}(['"`])/g,
      severity: "critical"
    },
    {
      type: "Private Key",
      regex: /-----BEGIN (?:RSA )?PRIVATE KEY-----/g,
      severity: "critical"
    },
    {
      type: "Stripe API Key",
      regex: /(sk|pk)_(test|live)_[0-9a-zA-Z]{24}/g,
      severity: "critical"
    },
    {
      type: "Generic Secret",
      regex: /(['"`])(secret|password|passwd|pwd|token)(['"`])(\s*[:=]\s*)(['"`])([a-zA-Z0-9_\-]{8,})(['"`])/gi,
      severity: "high"
    },
    {
      type: "Generic API Key",
      regex: /(?:(api|access)[-_]?key)(['"\s:=]+)([A-Za-z0-9\-_]{16,})/gi,
      severity: "critical"
    },
    {
      type: "JWT Secret / Token",
      regex: /eyJ[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_.+/=]*/g,
      severity: "high"
    }
  ];

  const results = {
    id: 2,
    name: "API Keys",
    message: "ok",
    issues: []
  };

  const lines = code.split("\n");

  patterns.forEach(pattern => {
    let match;
    const searchRegex = new RegExp(pattern.regex.source, "g");

    while ((match = searchRegex.exec(code)) !== null) {
      const codeUpToMatch = code.substring(0, match.index);
      const lineNumber = codeUpToMatch.split("\n").length;
      const lineContent = lines[lineNumber - 1];

      const maskedLine = lineContent.replace(
        match[0],
        match[0].replace(/([a-zA-Z0-9_\-]{8,})/g, "****")
      );

      results.issues.push({
        type: pattern.type,
        severity: pattern.severity,
        line: lineNumber,
        context: maskedLine,
        snippet: match[0].substring(0, 4) + "..." + match[0].slice(-4),
        recommendation: [
            '- Move this value to environment variables.',
            '- Do not commit secrets to source code.',
            '- Rotate if this was a real secret.'
          ]
      });

      results.message = "notOk";
    }
  });

  if (results.issues.length === 0) {
    results.message = "ok";
  }

  return results;
}
