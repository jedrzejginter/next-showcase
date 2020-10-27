# next-showcase

Alternative for Storybook working with Next.js.

**This project is for personal use mostly. I DO NOT recommend using it.**

## Installation

```bash
yarn add --dev @jg-tools/next-showcase

# or

npm i -D @jg-tools/next-showcase
```

## Usage

**Step 1**

Create showcase page.

```bash
# Genrate pages/next-showcase/index.tsx
npx next-showcase
```

Using in watch mode:

```bash
yarn add --dev onchange

# Run showcase in watch mode
# Updates pages/next-showcase/index.tsx on stories files changes
npx onchange -v 'src/**/*.stories.*' -- npx next-showcase
```

**Step 2**

Start your Next.js app server. Showcase will be available under `/next-showcase` url.

## Assumptions

This package makes some assumptions:
- you are using **Next.js**
- you are using **Typescript**
