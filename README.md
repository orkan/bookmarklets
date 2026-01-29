# Bookmarklets `v1.3.8`

Various bookmarklet utilities.

## Bookmarklets

- [Slugify](src/slugify/README.md)
- [Ping](src/ping/README.md)

## Develop

- To install `Node` package **directly** from GitHub:

  ```bash
  npm install git+https://github.com/MattMcAdams/CSS-Boilerplate.git
  npm install github:orkan/utilsjs.git#3.0.0
  ```

- What's the correct way to set a base `rem` value in CSS?

  You need to make your `html` font-size to 16px as your base font-size and then use rem with the rest. Rem sizes the element relative only to html while em sizes relatively to its nearest parent.

- GitHub 404 "File not found" on `node_modules` folder.

  Github pages uses a version of Jekyll that ignores `node_modules` folder by default. To fix it, create an empty `~/.nojekyll` text file.

- Create custom GitHub Action workflow to publish your site:

  - Settings > Pages: Build and deployment - Source: [Github Actions]
  - Choose template: Static HTML - Deploy static files in a repository without a build
  - Commit template: `[rel]/.github/workflows/static.yml` and copy to `[src]` repo.

  

## Links

- [Bookmarklets (repo)](https://github.com/orkan/bookmarklets)
- [Bookmarklets (page)](https://orkan.github.io/bookmarklets)
- [Bookmarklets (page deployments)](https://github.com/orkan/bookmarklets/deployments?environment=github-pages)

## Author

[Orkan](https://github.com/orkan)

## License

The Unlicense

## Updated

Thu, 29 Jan 2026 18:12:27 +01:00
