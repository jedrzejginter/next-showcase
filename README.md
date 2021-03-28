# next-showcase

> Very simple and basic alternative for Storybook working on Next.js.

## Warning :warning:

1. **This tool is completely Next.js-based, so it cannot be used without it.**
2. **For now I am just experimenting. I DO NOT recommend using it for anything that is not just having fun after hours.**

This package makes some assumptions:
- you are using **Next.js** (>= 9)
- you are using **Typescript** (>= 3.9)

## Installation

```bash
yarn add --dev @ginterdev/next-showcase

# or

npm i -D @ginterdev/next-showcase
```

## Usage

```bash
# Start your Next.js app
next dev -p 3000

# Start 'next-showcase' - visit localhost:3000/__showcase
npx next-showcase
```

_Make sure to add `pages/__showcase.tsx` to your `.gitignore`._
