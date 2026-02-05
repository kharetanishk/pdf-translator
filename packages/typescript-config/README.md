# @repo/typescript-config

Shared TypeScript configurations for the monorepo.

## Usage

In your `tsconfig.json`, extend the appropriate config:

```json
{
  "extends": "@repo/typescript-config/base.json"
}
```

Available configs:
- `base.json` - Base configuration for Node.js/API projects
- `nextjs.json` - Configuration for Next.js projects
- `react-library.json` - Configuration for React library packages

## Setup Requirements

1. **Install the dependency** in your package's `package.json`:
   ```json
   {
     "devDependencies": {
       "@repo/typescript-config": "workspace:*"
     }
   }
   ```

2. **Run `pnpm install`** from the monorepo root to link the workspace package:
   ```bash
   pnpm install
   ```

3. **Verify** TypeScript can resolve the config:
   ```bash
   pnpm tsc --noEmit
   ```

## Troubleshooting

If you see `File '@repo/typescript-config/base.json' not found`:

1. ✅ Check that `@repo/typescript-config` is in your `devDependencies`
2. ✅ Run `pnpm install` from the monorepo root
3. ✅ Verify the package exists in `packages/typescript-config/`
4. ✅ Check that your IDE/editor has reloaded the TypeScript configuration

## Why This Works

- The package uses `exports` field to explicitly export JSON files
- pnpm workspace links the package automatically
- TypeScript resolves packages from `node_modules` (or workspace links)
