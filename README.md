# Mangrove Atlas

![Screenshot 2023-07-14 at 08 48 02](https://github.com/Vizzuality/mangrove-atlas/assets/33252015/8fa99ca2-16d4-4563-92e0-2c063edfe6b6)

## Overview

Global Mangrove Watch (GMW) is an online platform that provides the remote sensing data and tools for monitoring mangroves necessary for this. It gives universal access to near real-time information on where and what changes there are to mangroves across the world, and highlights why they are valuable.

## Table of Contents

1. [Installation & development](#installation--development)
2. [Deployment](#deployment)
3. [Good practices & Style guide](#good-practices--style-guide)

## Installation & development

Requirements:

- NodeJs v18
- Yarn

## Project implementation

This platform is built upon [Vizzuality's scaffold project](https://github.com/Vizzuality/front-end-scaffold) and it's using the following resources:

- [React](https://reactjs.org/) as a UI library
- [Next.js](https://nextjs.org/) as a framework
- [Tailwind CSS](https://tailwindcss.com/) as a styles framework
- Reusable components such as forms, modals, icons, and other most use components
- [Recoil](https://recoiljs.org/)
- [Typescript](https://www.typescriptlang.org/) already configured
- git workflow and hooks
- editorconfig and code style based on [Airbnb](https://github.com/airbnb/javascript)

## Analytics

This project uses **Google Analytics 4 (GA4)** to track user interactions and behavior across the platform.

Analytics tracking is enabled via the environment variable:

NEXT_PUBLIC_GA_ID

Make sure this value is set in your environment when deploying or testing in environments where tracking is required.

Custom events are handled using [`react-ga4`](https://github.com/PriceRunner/react-ga4) and follow GA4's recommended structure (`event name` + `parameters`). Analytics is initialized in the app only when the GA ID is present.

If you need to add a new event, please follow the existing `trackEvent` wrapper pattern and ensure parameter names follow GA4 conventions.

## Quick start

In order to start modifying the app, please make sure to correctly configure your workstation:

1. Make sure you have [Node.js](https://nodejs.org/en/) installed
2. (Optional) Install [NVM](https://github.com/nvm-sh/nvm) to manage your different Node.js versions
3. (Optional) Use [Visual Studio Code](https://code.visualstudio.com/) as a text editor to benefit from automatic type checking
4. Configure your text editor with the [Prettier](https://prettier.io/), [ESLint](https://eslint.org/), [EditorConfig](https://editorconfig.org/), [Tailwind CSS](https://tailwindcss.com/docs/plugins) (recommended) and [Headwind](https://github.com/heybourn/headwind) (recommended) plugins
5. (Optional) Configure your editor to “format [code] on save” with ESLint and Prettier **(1)**
6. Use the correct Node.js version for this app by running `nvm use`; if you didn't install NVM (step 2), then manually install the Node.js version described in `.nvmrc`
7. Install the dependencies: `yarn`
8. Run the server: `yarn dev`

You can access a hot-reloaded version of the app on [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

First, we recommend to read the guideline about [how to use Vercel](https://vizzuality.github.io/frontismos/docs/guidelines/vercel/).

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contribution rules

Please, **create a PR** for any improvement or feature you want to add. Try not to commit anything directly on the `main` branch.

## Vulnerability mitigation

[Dependabot's vulnerability security alerts](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts) are configured in this repository and are displayed to the administrators.

When vulnerabilities are detected, a warning message is displayed at the top of the repository. The list of alerts can be found on the Dependabot alerts page.

Here's a step-by-step guide on how to address vulnerabilities found in production code:

1. Go to the Dependabot alerts page and locate the front-end vulnerability to address
2. Identify if the vulnerability affects production code:
   - To do so run `yarn npm audit --recursive --environment production`
   - If the dependency is _not_ listed by this command, then the vulnerability only affects the development code. You can dismiss the alert on GitHub as “Vulnerable code is not actually used” in the top right corner of the vulnerability page.
   - If the dependency _is_ listed, follow the steps below.
3. On the vulnerability page, click the “Create Dependabot security update” button
   - This will create a Pull Request with a fix for the vulnerability. If GitHub can generate this PR, then you can merge and the security alert will disappear.
   - If the vulnerability can't be patched automatically, follow the steps below.
4. If the action fails, then you can semi-automatically update the vulnerable dependency by running `npm_config_yes=true npx yarn-audit-fix --only prod`
   - `yarn-audit-fix` (see [repository](https://github.com/antongolub/yarn-audit-fix)) is a tool that applies the fixes from `npm audit fix` to Yarn installations
   - The tool might also not be able to fix the vulnerability. If so, continue with the steps below.
5. If the action fails, then you will have to manually update the dependencies until the vulnerability is solved

## Env variables

| Variable name                    | Description                           |         Default value |
| -------------------------------- | ------------------------------------- | --------------------: |
| NEXT_PUBLIC_API_URL              | URL of the API for widgets Data.      | http://localhost:3000 |
| NEXT_PUBLIC_ANALYSIS_API_URL     | URL of the API for the Analysis tool. | http://localhost:3000 |
| NEXT_PUBLIC_MAPBOX_API_TOKEN     | Mapbox token.                         |                       |
| NEXT_PUBLIC_GA_ID                | Google Analytics Tracking ID          |          G-JMJEG8GFH6 |
| NEXT_PUBLIC_PLANET_API_KEY       | URL of the Planet API.                |                       |
| NEXT_PUBLIC_BASE_URL             | Based URL of the project.             |                       |
| NEXT_PUBLIC_TRANSIFEX_API_KEY    | URL of the Transifex API.             |                       |
| NEXT_PUBLIC_BLOG_API_URL         | URL of the API for WordPress content. |                       |
| NEXT_PUBLIC_PLANET_API_KEY       | URL of the API for planet content.    |
| NEXT_PUBLIC_FEATURE_FLAG_WIDGETS |
