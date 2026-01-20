#!/usr/bin/env node

const { resolve } = require("node:path");
const { spawn } = require("child_process");

// Load configuration
const project = resolve(process.cwd(), "ldx.config.js");
let config;
try {
  config = require(project);
} catch (e) {
  console.error("Oops, no ldx.config.js file found!");
  process.exit(1);
}

// Validate configuration
function validateConfig(cfg) {
  if (!cfg || typeof cfg !== "object" || Array.isArray(cfg)) {
    return { valid: false, error: "Configuration must be a non-null object." };
  }

  const entries = Object.entries(cfg);
  if (entries.length === 0) {
    return { valid: false, error: "Configuration cannot be empty." };
  }

  for (const [key, value] of entries) {
    if (typeof value !== "string" && typeof value !== "function") {
      return {
        valid: false,
        error: `Invalid value type for key "${key}". Expected string or function, got ${typeof value}.`,
      };
    }
  }

  return { valid: true };
}

const validation = validateConfig(config);
if (!validation.valid) {
  console.error(`LDX: Configuration error - ${validation.error}`);
  process.exit(1);
}

console.log(
  "Thank you for using LDX! Collaborate or report issues at https://github.com/leog/ldx \n"
);

// Function to execute the command and process output
function executeAndProcessCommand() {
  return new Promise((resolve, reject) => {
    const command = process.argv.slice(2);
    if (command.length === 0) {
      reject(new Error("No command provided."));
      return;
    }

    const child = spawn(command[0], command.slice(1));

    // Handle spawn errors (e.g., command not found)
    child.on("error", (error) => {
      reject(new Error(`Failed to start command: ${error.message}`));
    });

    // Handle stdout
    if (child.stdout) {
      child.stdout.on("data", (data) => {
        const lines = data.toString().split("\n");
        lines.forEach((line) => {
          const processedLine = processOutput(line);
          if (processedLine) {
            console.log(processedLine); // Output the processed line
          }
        });
      });
    }

    // Handle stderr
    if (child.stderr) {
      child.stderr.on("data", (data) => {
        const lines = data.toString().split("\n");
        lines.forEach((line) => {
          const processedLine = processOutput(line);
          if (processedLine) {
            console.error(processedLine); // Output processed error line to stderr
          } else if (line.trim()) {
            console.error(line); // Pass through unmatched non-empty lines
          }
        });
      });
    }

    // Handle process exit
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

// Function to process each line of output
function processOutput(line) {
  // Check static matches first (O(n) lookup, but optimized for small n)
  const match = Object.entries(config).find(([key]) => line.includes(key));

  if (match) {
    const [key, value] = match;

    // Handle string values
    if (typeof value === "string") {
      return value;
    }

    // Handle function values
    if (typeof value === "function") {
      try {
        return value(line);
      } catch (e) {
        console.warn("LDX: provided function errored: ", e.message);
        return line; // Return original line on error to prevent data loss
      }
    }

    // Handle invalid configurations
    console.warn(
      `Invalid configuration for key: ${key}. Expected string or function.`
    );
  }

  // No match found
  return undefined;
}

// Export functions for testing
module.exports = {
  processOutput,
  executeAndProcessCommand,
  validateConfig,
};

// Execute the command if this script is run directly
/* v8 ignore start */
if (require.main === module) {
  // Main execution
  executeAndProcessCommand()
    .then(() => console.log("Command executed successfully."))
    .catch((error) => console.error("Error executing command:", error));
}
/* v8 ignore end */
