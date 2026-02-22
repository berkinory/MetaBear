<div align="center">

# 🐻 MetaBear

**All in one browser extension for web developers**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Install_Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/metabear-seo-accessibilit/jklebfmomoajnoocichmchpdbkcbibac)

---

</div>

## Local Development

### Requirements

- Package Manager (Npm, Bun, etc.)
- Chrome or Firefox browser

### Setup

Install dependencies

```bash
bun install
```

Go to the extension directory

```bash
cd apps/extension
```

Run the extension in development mode

```bash
bun run dev
# or for Firefox
bun run dev:firefox
```

WXT opens and reloads the extension automatically.

### Build

```bash
bun run build
```

Build output goes to `apps/extension/.output/chrome-mv3`.

To create a zip:

```bash
bun run zip
```

## Repo Scripts

Run these commands from the **root** directory:

```bash
# Code quality checks
bun run check

# TypeScript type checks
bun run check-types
```

## Structure

- `apps/extension` - Chrome/Firefox extension source
- `packages` - shared configs and packages
