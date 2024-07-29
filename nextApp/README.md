## Getting Started

### Node installation

1. Install [NVM]https://nvm.sh)

2. Install Node.js

```bash
nvm install
nvm use
```

Note: the `.nvmrc` file specifies the node version to use.

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Amplify new branch setup

1. Create a new branch in the repository

2. Assign the framework to the branch

```bash
AWS_PROFILE=<profile-name> aws amplify update-branch --app-id <app-ia> --branch-name <branch-name> --framework 'Next.js - SSR'
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Major dependencies

The following main libraries and tools are used in the project

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [eCharts](https://echarts.apache.org/)
- [MapGl](https://visgl.github.io/react-map-gl/)

# Release to staging

1. Create release branch from `develop`

```bash
git checkout develop
git pull
git checkout -b release/x.x.x
```

2. Update version in `package.json` and commit changes

3. Reset `stage` branch to `release/x.x.x`

```bash
git checkout stage
git reset --hard release/x.x.x
git push origin stage --force
```
