# Portfolio

Personal portfolio website built with Vue 3, TypeScript, Vite, and Tailwind CSS.

## Getting Started

**Prerequisites:** Node.js (v18+) and npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The site will be available at `http://localhost:5173`.

### Other commands

| Command | Description |
|---|---|
| `npm run build` | Build for production (output in `docs/`, served by GitHub Pages) |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Build, commit, and push the site to GitHub Pages |

## Deployment

The site is hosted with **GitHub Pages** from the `docs/` folder on the `master`
branch. `npm run build` outputs the production build straight into `docs/`.

To build and publish in one step:

```bash
npm run deploy            # timestamped commit message
npm run deploy "message"  # custom commit message
```

This runs [`deploy.sh`](deploy.sh), which builds the site, commits the result,
and pushes to the current branch. GitHub Pages then serves the updated site at
<https://bkhmsi.github.io>.
