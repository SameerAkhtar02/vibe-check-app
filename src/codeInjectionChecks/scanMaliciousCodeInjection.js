export function scanForInjectionVulnerabilities(code, language = "js") {
    // Normalize the language input for flexibility
    const normalizedLanguage = language.toLowerCase() === "py" || language.toLowerCase() === "python" 
                               ? "python" 
                               : language.toLowerCase() === "js" || language.toLowerCase() === "javascript" 
                               ? "js" 
                               : language;
  
    const issues = [];
    
    // Debug: Log normalized language
    console.log("Normalized Language:", normalizedLanguage);
  
    // Injection patterns to look for
    const patterns = [
      // SQL Injection - Match code that is concatenating user input in queries (for JS and Python)
      {
        type: "SQL Injection",
        regex: /\b(query|execute|find)\s*\(\s*(.*\+\s*(req\.|input\(|request\.)|.*`.*\+\s*(req\.|input\(|request\.)|.*\${.*\+.*req\..*})/gi,
        message: "Avoid concatenating user input in SQL queries. Use parameterized queries.",
        languages: ["js", "python"]
      },
  
      // XSS (Cross-Site Scripting) - JS-specific
      {
        type: "XSS",
        regex: /innerHTML\s*=\s*(req\.|input\(|request\.)/gi,
        message: "Avoid setting innerHTML with user input. Use textContent or sanitization.",
        languages: ["js"]
      },
      {
        type: "XSS",
        regex: /document\.write\s*\(/gi,
        message: "Avoid document.write with user input. Use safer rendering techniques.",
        languages: ["js"]
      },
  
      // Command Injection - JS and Python
      {
        type: "Command Injection",
        regex: /\b(exec|spawn|execSync)\s*\(.*?\+\s*(req\.|input\(|request\.)/gi,
        message: "Avoid command execution with unsanitized input. Use validation or safer APIs.",
        languages: ["js"]
      },
      {
        type: "Command Injection",
        regex: /\bsubprocess\.(call|Popen)\s*\(.*?\+\s*input\(/gi,
        message: "Avoid subprocess with input(). Use shlex.split or other sanitization methods.",
        languages: ["python"]
      },
      {
        type: "Command Injection",
        regex: /\bsystem\s*\(.*?\+\s*input\(/gi,
        message: "Avoid using os.system with raw input. Use subprocess with controlled args.",
        languages: ["python"]
      }
    ];
  
    // Iterate over each pattern and check if it matches
    for (const pattern of patterns) {
      // Skip the pattern if it doesn't match the given language
      if (!pattern.languages.includes(normalizedLanguage)) continue;
  
      let match;
      // Debug: Log the regex and code being tested
      console.log(`Checking for: ${pattern.type} with regex: ${pattern.regex}`);
      while ((match = pattern.regex.exec(code)) !== null) {
        console.log(`Match found for ${pattern.type}:`, match); // Log the match
  
        issues.push({
          type: pattern.type,
          message: pattern.message,
          line: code.substring(0, match.index).split("\n").length,
          snippet: match[0]
        });
      }
    }
  
    // Debug: Log issues array after scanning
    console.log("Issues found:", issues);
  
    return issues;
  }
  