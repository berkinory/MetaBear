# MetaBear

All in one browser extension for web developers.

## Local Development

### Requirements

- Package Manager (Npm, Bun, etc.)
- Chrome or Firefox browser

### Setup

Install dependencies

```bash
npm install
```

Run the extension in development mode

```bash
npm --cwd apps/extension run dev
or
npm --cwd apps/extension run dev:firefox
```

WXT opens and reloads the extension automatically.

### Build

```bash
npm --cwd apps/extension run build
```

Build output goes to `apps/extension/.output/chrome-mv3`.

To create a zip:

```bash
npm --cwd apps/extension run zip
```

## Repo Scripts

`npm run check` and `npm run check-types` run code and type checks across the repo.

## Structure

- `apps/extension` - Chrome/Firefox extension source
- `packages` - shared configs and packages
