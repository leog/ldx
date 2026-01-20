/**
 * LDX Configuration Example
 *
 * This file demonstrates how to configure LDX to transform command output.
 * Copy this file to `ldx.config.js` in your project root and customize it.
 */

module.exports = {
  // Simple string replacement
  // When the output contains the key, the entire line is replaced with the value
  "error": "Error occurred in the application",
  "warning": "Warning: Please review this message",
  "success": "Operation completed successfully",

  // Function-based transformation
  // Receives the full line and returns the transformed output
  "timestamp": (line) => {
    const now = new Date().toISOString();
    return `[${now}] ${line}`;
  },

  // Extract and highlight specific patterns
  "DEBUG": (line) => {
    return `[DEBUG] ${line.replace("DEBUG", "").trim()}`;
  },

  // Conditional transformation
  "HTTP": (line) => {
    if (line.includes("200")) {
      return `[OK] ${line}`;
    } else if (line.includes("404")) {
      return `[NOT FOUND] ${line}`;
    } else if (line.includes("500")) {
      return `[SERVER ERROR] ${line}`;
    }
    return line;
  },
};
