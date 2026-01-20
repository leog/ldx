# LDX - Logging Developer Experience

A lightweight tool to enhance your development workflow by processing command output with customizable transformations.

## Features

- **Custom static transformations**: Define string patterns in your command output and replace them with custom messages.

- **Custom dynamic transformations**: Supports function-based transformations

- **Easy Integration**: Works seamlessly with any command-line tool or script.

- **Developer-Friendly**: Improves readability and reduces noise in logs.

## Installation

To install LDX globally, run:

```bash
pnpm install -g ldx
```

Alternatively, you can install it locally in your project:

```bash
pnpm install --save-dev ldx
```

## Usage

### 1. Create a Configuration File

Create a `ldx.config.js` file in your project's root directory. This file defines the patterns and transformations for your command output.

Example:

```js
module.exports = {
  // Simple string replacement
  "Test match 1": "✅ Test match 1 processed",

  // Function-based processing
  "Function match": (line) => `Processed: ${line}`,
};
```

### 2. Run Commands with LDX

Use LDX to run your commands and transform their output:

```bash
ldx <your-command>
```

For example:

```bash
ldx pnpm run dev
```

## Configuration Options

### String Matching

```js
module.exports = {
  "String contained in output line": "Replacement text for the entire line"
}
```

### Function Processing

```js
module.exports = {
  "String contained in output line": (line) => {
    // Custom processing logic
    return `Formatted: ${line}`;
  }
}
```

## Requirements

- Node.js >= 18.0.0

## Error Handling

LDX provides clear error messages for common issues:

### Missing Configuration File

If `ldx.config.js` is not found in your project root:

```text
Oops, no ldx.config.js file found!
```

**Solution**: Create a `ldx.config.js` file in your project root. You can copy `ldx.config.example.js` as a starting point.

### Invalid Configuration

If your configuration has invalid values:

```text
LDX: Configuration error - Invalid value type for key "myKey". Expected string or function, got number.
```

**Solution**: Ensure all configuration values are either strings or functions.

### Empty Configuration

If your configuration object is empty:

```text
LDX: Configuration error - Configuration cannot be empty.
```

**Solution**: Add at least one pattern-transformation pair to your configuration.

### Command Not Found

If the command you're trying to run doesn't exist:

```text
Error executing command: Failed to start command: spawn xyz ENOENT
```

**Solution**: Verify the command exists and is in your PATH.

### Function Processing Errors

If a transformer function throws an error, LDX will:

1. Log a warning: `LDX: provided function errored: <error message>`
2. Output the original unprocessed line (to prevent data loss)

**Solution**: Add try-catch blocks in your transformer functions for graceful error handling.

## Testing

Run tests with:

```bash
pnpm test
```

## Usage examples

### Basic Usage

```bash
ldx echo "Testing LDX tool"
```

### With package manager scripts

```bash
ldx pnpm run dev
```

### With complex commands

```bash
ldx docker-compose up
```

## Development

1. Clone the repository

2. Install dependencies:

   ```bash
   pnpm i
   ```

3. Make changes

4. Run tests:

   ```bash
   pnpm test
   ```

## Releasing

This project uses [standard-version](https://github.com/conventional-changelog/standard-version) for automated versioning and changelog generation based on [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Message Format

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`

Examples:

```bash
git commit -m "feat: add support for regex patterns"
git commit -m "fix: handle empty lines in output"
git commit -m "docs: update configuration examples"
```

### Creating a Release

```bash
# Automatic version bump based on commits (recommended)
pnpm release

# Specific version bumps
pnpm release:patch  # 1.0.2 -> 1.0.3
pnpm release:minor  # 1.0.2 -> 1.1.0
pnpm release:major  # 1.0.2 -> 2.0.0
```

After running the release command:

```bash
git push --follow-tags origin main && npm publish
```

## Contributing

Contributions are welcome! Please open issues or pull requests in this repo.
