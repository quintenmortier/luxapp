# Lux Bingo

This project is ready to publish as a static GitHub Pages site and install on a phone as a PWA.

## Publish On GitHub Pages

1. Create a GitHub repository for this project.
2. Push the files in this folder to the repository's default branch, usually `main`.
3. In GitHub, open `Settings` -> `Pages`.
4. Under `Build and deployment`, set:
   `Source`: `Deploy from a branch`
   `Branch`: `main`
   `Folder`: `/ (root)`
5. Save and wait for GitHub Pages to publish the site.

If your repository is named `luxapp` and your GitHub username is `yourname`, the site URL will usually be:

`https://yourname.github.io/luxapp/`

If the repository is named `yourname.github.io`, the site URL will be:

`https://yourname.github.io/`

## Install On iPhone

1. Open the published site in Safari.
2. Tap `Share`.
3. Tap `Add to Home Screen`.
4. Turn on `Open as Web App`.
5. Tap `Add`.

## Install On Android

1. Open the published site in Chrome.
2. Tap the browser menu.
3. Tap `Install app` or `Add to Home screen`.

## Notes

- This project uses a web app manifest, service worker, and app icons for installability.
- GitHub Pages must serve the app over `https`; opening `index.html` directly from disk is not enough for installation.
- The `.nojekyll` file tells GitHub Pages to publish the static files directly.
