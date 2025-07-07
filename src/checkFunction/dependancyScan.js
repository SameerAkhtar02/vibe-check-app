import semver from "semver"; // or const semver = require('semver')


const vulnerablePackages = {
    "lodash": {
      vulnerableVersions: ["<4.17.21"],
      fixVersion: ">=4.17.21",
      reason: "Prototype pollution vulnerability"
    },
    "shelljs": {
      vulnerableVersions: ["*"],
      fixVersion: "Avoid usage if possible",
      reason: "May allow command injection"
    },
    "jquery": {
      vulnerableVersions: ["<3.5.0"],
      fixVersion: ">=3.5.0",
      reason: "XSS and security bypass issues"
    }
  };
  



export  function scanDependencies(packageJsonContent) {
    const dependencies = {
      ...packageJsonContent.dependencies,
      ...packageJsonContent.devDependencies
    };
  
    const issues = [];
  
    for (const [pkg, versionRange] of Object.entries(dependencies)) {
      const info = vulnerablePackages[pkg];
      if (info) {
        const vulnVersions = info.vulnerableVersions;
        for (const vulnVersion of vulnVersions) {
          if (semver.satisfies(semver.minVersion(versionRange), vulnVersion)) {
            issues.push({
              package: pkg,
              version: versionRange,
              reason: info.reason,
              fix: info.fixVersion
            });
            break;
          }
        }
      }
    }
  console.log(dependencies,packageJsonContent)
    return issues;
  }
function compareVersion(current, vulnExpression) {
    const numeric = (v) => v.replace(/[^\d.]/g, '').split('.').map(Number);
  
    const [majorC, minorC = 0, patchC = 0] = numeric(current);
    const [majorV, minorV = 0, patchV = 0] = numeric(vulnExpression);
  
    if (vulnExpression.startsWith("<")) {
      return (
        majorC < majorV ||
        (majorC === majorV && minorC < minorV) ||
        (majorC === majorV && minorC === minorV && patchC < patchV)
      );
    }
    return false;
  }
  