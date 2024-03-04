# ChainFuse

https://chainfuse.com — blockchain infrastructure as a service

- **Cloudflare**: [DNS](https://dash.cloudflare.com/e9b82b39aa91575a2643529d24a1bf02/chainfuse.com/dns), [Workers](https://dash.cloudflare.com/e9b82b39aa91575a2643529d24a1bf02/workers/overview), [Worker Routes](https://dash.cloudflare.com/e9b82b39aa91575a2643529d24a1bf02/chainfuse.com/workers), [Custom Hostnames](https://dash.cloudflare.com/e9b82b39aa91575a2643529d24a1bf02/chainfuse.com/ssl-tls/custom-hostnames)
- **Google Cloud**: [Home](https://console.cloud.google.com/welcome?project=chainfuse) ([test](https://console.cloud.google.com/welcome?project=chainfuse-test)), [Firestore](https://console.cloud.google.com/firestore/data?project=chainfuse) ([test](https://console.cloud.google.com/firestore/data?project=chainfuse-test)), [Storage](https://console.cloud.google.com/storage/browser?project=chainfuse) ([test](https://console.cloud.google.com/storage/browser?project=chainfuse-test)), [IAM](https://console.cloud.google.com/iam-admin/iam?project=chainfuse) ([test](https://console.cloud.google.com/iam-admin/iam?project=chainfuse-test))
- **Google Analytics**: [Home](https://analytics.google.com/analytics/web/#/p328802390/reports/intelligenthome) ([test](https://analytics.google.com/analytics/web/#/p328802486/reports/intelligenthome)), [Reports](https://analytics.google.com/analytics/web/#/p328802390/reports/reportinghub) ([test](https://analytics.google.com/analytics/web/#/p328802486/reports/reportinghub)), [Data Streams](https://analytics.google.com/analytics/web/#/a234925159p328802390/admin/streams/table/3851613988) ([test](https://analytics.google.com/analytics/web/#/a234925159p328802486/admin/streams/table/3856197442))
- **Firebase**: [Overview](https://console.firebase.google.com/project/chainfuse/overview) ([test](https://console.firebase.google.com/project/chainfuse-test/overview)), [Users](https://console.firebase.google.com/project/chainfuse/authentication/users) ([test](https://console.firebase.google.com/project/chainfuse-test/authentication/users))

---

This project was bootstrapped with [React Starter Kit](https://github.com/kriasoft/react-starter-kit).
Be sure to join our [Discord channel](https://discord.gg/2nKEnKq) for assistance.

## Directory Structure

`├──`[`.github/workflows`](./.github/workflows/) — CI/CD workflows powered by [GitHub Actions](https://github.com/features/actions)<br>
`├──`[`.vscode`](.vscode) — [VSCode](https://code.visualstudio.com/) settings including code snippets, recommended extensions etc.<br>
`├──`[`env`](./env) — Settings for `local` (dev), `test` (staging/QA), and `prod` (production) environments<br>
`├──`[`api`](./api) — API endpoint handling customer sites provisioning ([GCF](https://console.cloud.google.com/functions/list?project=chainfuse))<br>
`├──`[`app`](./app) — ChainFuse customer dashboard built with [Vite](https://vitejs.dev/) and [React.js](https://reactjs.org/)<br>
`├──`[`core`](./core) — Core ChainFuse components that are re-used across multiple workspaces<br>
`├──`[`admin`](./admin) — ChainFuse admin dashboard built with [Vite](https://vitejs.dev/) and [React.js](https://reactjs.org/)<br>
`├──`[`site`](./site) — [Cloudflare Workers](https://workers.cloudflare.com/) script for serving static websites (reverse proxy)<br>
`├──`[`marketplace`](./marketplace) — NFT Marketplace site template<br>
`├──`[`tokendrop`](./tokendrop) — NFT Token Drop site template<br>
`├──`[`scripts`](./scripts) — Automation scripts, such as `yarn deploy`<br>
`├──`[`package.json`](./project.json) — The list of [NPM](https://www.npmjs.com/) dependencies and [Yarn](https://yarnpkg.com/) workspaces<br>
`├──`[`rollup.config.mjs`](./rollup.config.mjs) — [Rollup](https://rollupjs.org/) configuration for compiling and bundling [CF Workers](https://workers.cloudflare.com/)<br>
`└──`[`tsconfig.base.json`](./tsconfig.base.json) — [TypeScript](https://www.typescriptlang.org/) configuration shared across packages/workspaces<br>

## Tech Stack

- [React](https://reactjs.org/), [React Router](https://reactrouter.com/),
  [Emotion](https://emotion.sh/), [Material UI](https://next.material-ui.com/),
  [Recoil](https://recoiljs.org/), [Firestore](https://firebase.google.com/docs/firestore),
  [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Vite](https://vitejs.dev/), [Rollup](https://rollupjs.org/),
  [TypeScript](https://www.typescriptlang.org/), [ESLint](https://eslint.org/),
  [Prettier](https://prettier.io/), [Jest](https://jestjs.io/),
  [Yarn](https://yarnpkg.com/) with PnP

## Requirements

- [Node.js](https://nodejs.org/) v18+ with [Corepack](https://nodejs.org/api/corepack.html) (`$ corepack enable`)
- [VS Code](https://code.visualstudio.com/) editor with [recommended extensions](.vscode/extensions.json)
- Optionally [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
  and [Reactime](https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga?hl=en) browser extensions

## Getting Started

Just clone the repository, install dependencies, open it in VSCode and start hacking:

```bash
$ git clone https://github.com/ChainFuse/chainfuse.git
$ cd ./chainfuse
$ yarn install
$ yarn start
$ yarn test
```

Find the worker scripts inside of the [`./site`](./site/) and [`./api`](./api/) folders.

**IMPORTANT**: Ensure that VSCode is using the [workspace version of TypeScript](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-newer-typescript-versions).

**TIP**: Sometimes after Vite configuration has been changed, you may need to
reset its cache by using `--force` flag, for example:

```
$ yarn workspace app start --force
$ yarn workspace admin start --force
```

## Scripts

- **`yarn start`** - Launches web application on [`http://localhost:3000/`](http://localhost:3000/)
- **`yarn db`** - Launches REPL shell connected to the Firestore database
- **`yarn lint`** — Validates the code using [ESLint](https://eslint.org/)
- **`yarn tsc`** — Validates the code using [TypeScript](https://www.typescriptlang.org/) compiler
- **`yarn test`** — Runs unit tests with [Jest](https://jestjs.io/), [Miniflare](https://miniflare.dev/), and [Supertest](https://github.com/visionmedia/supertest)
- **`yarn build`** — Compiles and bundles worker scripts into the `./dist` folder(s)
- **`yarn deploy`** — Deploys the app to [Cloudflare Workers](https://developers.cloudflare.com/workers/) / [GCF](https://cloud.google.com/functions)
- **`yarn cf <workspace>`** — [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/) wrapper with support of [`*.env`](./env) files

## How to the local version of [`@chainfuse/ui`](https://github.com/ChainFuse/chainfuse-js)

```
$ yarn workspace app link ../../chainfuse-js/core/
$ yarn workspace app link ../../chainfuse-js/react/
$ yarn workspace app link ../../chainfuse-js/ui/
```

Just to ensure to rollback the modified `package.json` and `yarn.lock` files
before pushing your changes to GitHub.

## How to Contribute

1. Create a new branch for a feature, tweak, or a bug fix off the main branch:

```bash
$ git fetch origin
$ git checkout -b koistya/fix-auth-flow origin/main
```

2. Make code changes, commit locally using [`conventionalcommits.org`](https://www.conventionalcommits.org/) style

3. Push to GitHub, create a pull request (PR), ask team mates for a review if needed

4. Ensure that the CI/CD workflow successfully runs code quality checks and unit tests; merge to `main`

**NOTE**: If your PR is behind the `main` branch, ensure that it's [up-to-date](https://stackoverflow.com/questions/3876977/update-git-branches-from-master)

#### References

- [Write better commits, build better projects](https://github.blog/2022-06-30-write-better-commits-build-better-projects/)
- [Creating a pull request (PR)](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)

## How to Style React Components

- Prefer using `sx={...}` prop for styling React components as opposed to using `makeStyles(...)` or `styled(...)` (legacy) approaches
- Prefer updating styles globally for all components (in [`app/theme/components.ts`](./app/theme/components.ts))
- Ensure that custom React components can be styled similarly to Material UI components
- Use named functions (as opposed to anonymous/lambda) when creating React components

```tsx
import { Card, CardProps } from "@mui/material";

export function ExampleCard(props: ExampleCardProps): JSX.Element {
  const { sx, ...other } = props;
  return (
    <Card sx={{ p: 2, ...sx }} {...other}>
      {/* ... */}
    </Card>
  );
}

type ExampleCardProps = CardProps;
```

For more code samples please refer to [Material UI source code](https://github.com/mui/material-ui/tree/master/packages/mui-material/src).

## How to Add Dependencies

- `yarn workspace <workspace> add <package>` (e.g. `yarn workspace marketplace add react`)

## How to Update

- `yarn set version stable` — Bump Yarn to the latest version
- `yarn upgrade-interactive` — Update Node.js modules (dependencies)
- `yarn dlx @yarnpkg/sdks vscode` — Update TypeScript, ESLint, and Prettier settings in VSCode

## How to Deploy

The deployments are handled automatically by [GitHub Actions](https://github.com/features/actions)
(see [`.github/workflows`](.github/workflows/)) whenever a new commit lands onto
one of these branches:

- **`main`** — Deploys the app to [`https://test.chainfuse.com`](https://test.chainfuse.com/) (test/QA)
- **`release`** — Deploys the app to [`https://chainfuse.com`](https://chainfuse.com/) (production)

Alternatively, you can deploy the app manually by ensuring the all the
required environment variables found in the [`*.env`](./env/) files are
up-to-date (e.g. `CLOUDFLARE_API_TOKEN`), then running `yarn deploy [--env #0]`,
specifying the target deployment area via `--env` flag, e.g. `--env=test`
(default) or `--env=prod`.

You can also deploy packages (workspaces) individually, for example:

```bash
$ yarn api:deploy --env=prod
$ yarn site:deploy --env=prod
```

<p align="center"><img src="https://files.tarkus.me/cloudflare-workers-deploy.svg" /></p>

## How to View Logs

```
$ yarn api:logs [--env #0]
$ yarn site:cf tail [--env #0]
```

## License

Copyright © 2020-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/cloudflare-starter-kit/blob/main/LICENSE) file.

---

<sup>Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya), [blog](https://medium.com/@koistya))
and [contributors](https://github.com/kriasoft/cloudflare-starter-kit/graphs/contributors).</sup>
