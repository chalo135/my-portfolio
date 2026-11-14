# Deploying the site

The site is hosted on **Vercel** (free Hobby plan). Vercel builds and
publishes it every time you push to GitHub. There is no server to manage and
nothing to upload.

- Live site: `https://charlesndirangu.com` (`www` redirects to it)
- Production branch: `main`
- Repo: `chalo135/my-portfolio`

---

## 1. First deploy

1. **Put the new site on `main`.** The redesign is on the `workbench` branch.
   Vercel publishes `main`, so merge first:

   ```
   git checkout main
   git merge workbench
   git push origin main
   ```

2. Sign in at [vercel.com](https://vercel.com) with GitHub.
3. Choose **Add New → Project** and import `chalo135/my-portfolio`.
4. Vercel detects Next.js. Leave the build settings and environment variables
   as they are. Click **Deploy**.
5. Open the `*.vercel.app` link it gives you and check the site.

## 2. Domain

1. In the project, open **Settings → Domains**.
2. Add `charlesndirangu.com` and `www.charlesndirangu.com`. Set `www` to
   redirect to `charlesndirangu.com`.
3. Vercel shows the exact DNS records to add. Copy them into the DNS settings
   where you bought the domain. Use the values Vercel shows you, not values
   from a guide.
4. If the domain is on Cloudflare, set those records to **DNS only** (grey
   cloud), not proxied.
5. Vercel issues the HTTPS certificate by itself once the DNS records work.
   That can take a few minutes to an hour. Until then the site may not open
   on the domain.

## 3. Every deploy after that

Push to `main`. Vercel builds and publishes it in a minute or two.

Any other branch gets its own preview link. Open it and check before you
merge into `main`.

GitHub also runs a check on every push (`.github/workflows/ci.yml`): types,
lint, a build and the link checker. It only checks. It does not deploy.

## 4. Rolling back

In the Vercel project, open **Deployments**. Open an older one that worked
and choose **Promote to Production** (or **Instant Rollback**).

## 5. Checking it's live

From your computer, in the project folder:

```
npm run check:links -- https://charlesndirangu.com
```

It reads the sitemap, opens every page and every link on it, and checks that
a missing page answers 404. It should end with `All checks passed.`

A few quick checks by hand:

```
# 307 to /en/
curl -sI https://charlesndirangu.com/ | grep -iE '^(HTTP|location)'

# 308 to /en/about/
curl -sI https://charlesndirangu.com/en/about | grep -iE '^(HTTP|location)'

# An old link: 308 to /en/work/
curl -sI https://charlesndirangu.com/projects/ | grep -iE '^(HTTP|location)'

# Has x-content-type-options: nosniff
curl -sI https://charlesndirangu.com/en/ | grep -i x-content-type-options

# The share image: 200 and image/png
curl -sI https://charlesndirangu.com/en/opengraph-image/ | grep -iE '^(HTTP|content-type)'

# A missing page: 404
curl -sI https://charlesndirangu.com/does-not-exist/ | head -1
```

Old links and where they go (each is a permanent redirect; a link without
its trailing slash takes one extra hop to add it):

| Old path | Goes to |
|---|---|
| `/` | `/en/` (temporary) |
| `/work/`, `/about/`, `/contact/` | `/en/work/`, `/en/about/`, `/en/contact/` |
| `/projects/`, `/projects/<slug>/`, `/capabilities/`, `/technologies/` | `/en/work/` |
| `/philosophy/`, `/writing/`, `/writing/<slug>/` | `/en/` |
| `/experience/`, `/resume/` | `/en/about/` |
| The same removed pages under `/en/` or `/sw/` | That language's Work, Home or About page |
| `/favicon.svg` | `/icon.svg` |

The list lives in `next.config.ts`.

## 6. Clean-up

- In GitHub → **Settings → Secrets and variables → Actions**, delete
  `SSH_HOST`, `SSH_PORT`, `SSH_USER`, `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`
  and `DEPLOY_PATH` if they exist. Nothing uses them now.
- If a hosting.com plan was only for this site, you can cancel it once the
  domain points at Vercel and the site loads.

## 7. Before you tell people about it

- **Email and domain on the CV.** The CV shows `ndirangu.c.mwangi@gmail.com`
  and `charlesmwangi.com`. The site shows `charlesndirangu10447@gmail.com`
  and lives at `charlesndirangu.com`. Make them match.
- **Project screenshots.** Add `public/work/<slug>.webp` (1600×800) for each
  project. Without one, the print shows a colour panel.
- **Twitter and Instagram.** Set `twitter` and `instagram` in
  `src/content/site.ts` to show their icons in the footer.
- **Kiswahili.** Ask a fluent speaker to read `SWAHILI_COPY_REVIEW.md`.

## Running it on your computer

```
npm install
npm run dev      # http://localhost:3000/en/, reloads as you edit
```

To test the real build:

```
npm run build
npm start        # http://localhost:3000/en/
npm run check:links
```

If `npm run build` fails with an error in `next/font`, your connection
dropped while it fetched the fonts. Run it again.
