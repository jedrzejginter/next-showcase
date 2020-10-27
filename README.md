# next-showcase

Alternative for Storybook working with Next.js.

**This project is for personal use mostly. I DO NOT recommend using it.**

## Installation

```bash
yarn add --dev next-showcase

# or

npm i -D next-showcase
```

## Usage

```bash
# Genrate pages/showcase.tsx
npx next-showcase

# Run showcase in watch mode
# Updates pages/showcase.tsx on stories files changes
npx next-showcase-watch
```

## Assumptions

This package makes some assumptions:
- you are using **Next.js**
- you are using **Typescript**
- you have custom webpack alias set – `@/*` resolves to `src/*`
