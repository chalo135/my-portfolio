# Deploying the site

The site is a **static export**. `npm run build` writes plain files into `out/`.
hosting.com serves those files. Nothing runs on the server, so you don't need Node.js there.

- Live site: `https://charlesndirangu.com` (bare domain, no `www`)
- Deploy branch: `main`. To change it, edit `branches: [main]` near the top of
  `.github/workflows/deploy.yml`.
- Redirects, cache headers and security headers live in `public/.htaccess`,
  not `next.config.ts`.
- The site is four pages (Home, Work, About, Contact) in two languages:
  eight pages, under `/en/` and `/sw/`.

> **The Workbench redesign is on the `workbench` branch. Nothing deploys until
> it is merged into `main`.** A push to `main` deploys.
>
> ```bash
> git checkout main
> git merge workbench
> git push origin main
> ```

## Before you go live

- [ ] Your photo (`public/me/chalo.jpg`) and CV
      (`public/cv/charles-ndirangu-cv.pdf`) are in place. Both are there now;
      open the built site and check they are the ones you want.
- [ ] The CV gives a different email (`ndirangu.c.mwangi@gmail.com`) and a
      different website (`charlesmwangi.com`) from the site
      (`charlesndirangu10447@gmail.com`, `charlesndirangu.com`). Decide which
      is right, then fix the CV or `contact.email` in `src/content/site.ts`.
- [ ] Add a screenshot for each project under `public/work/` (names and sizes
      are in `README.md`). Without one, the print shows a colour panel.
- [ ] If you want Twitter or Instagram icons in the footer, set `twitter` and
      `instagram` in `src/content/site.ts`.
- [ ] Have a fluent Kiswahili speaker read `SWAHILI_COPY_REVIEW.md`.
- [ ] Run `npm run build` then `npm run check:export`. The last line must say
      `All checks passed.`
- [ ] Merge `workbench` into `main` (above).
- [ ] After the deploy, run the checks in section 7.

---

## 1. One-time setup on hosting.com

1. **Plan.** The cheapest shared plan that hosts one website is enough.
2. **Domain.** Point the domain at the hosting account.
   - Registered at hosting.com: nothing to do.
   - Registered elsewhere: at your registrar, either switch the nameservers to
     the ones hosting.com gives you, or add the A record they give you (for
     `@`, and for `www` too).
   - SSL is issued automatically once DNS points at hosting.com. That can take
     a few hours.
3. **SSH details.** Log in at `my.hosting.com` and open your hosting account's
   SSH page. Write down:
   - **Host** (server name or IP)
   - **Username**
   - **Port**. Newer accounts use `22`, older cPanel accounts use `7822`.
     Copy the port from the panel; don't guess.
4. **Site folder.** Usually `public_html` in your home folder, for example
   `/home/USERNAME/public_html`. That full path is your `DEPLOY_PATH`.
5. **Back up the existing `.htaccess`.** In File Manager, open the site
   folder, turn on "show hidden files", and download any `.htaccess` that's
   already there. Keep it. If it has a block the host added (it often mentions
   PHP, LiteSpeed cache or a handler), show it to Claude before your first
   deploy, because the deploy replaces that file.

## 2. Deploy key

Make a key used only for deploys. On your computer:

```bash
ssh-keygen -t ed25519 -f deploy_key -C "github-deploy" -N ""
```

That makes two files:

- `deploy_key.pub` is the public half. In the hosting panel's **SSH Keys**
  page, add it (or import it) and **authorise** it.
- `deploy_key` is the private half. It goes into GitHub (step 3). Never
  commit it.

Test it (use your own port, user and host):

```bash
ssh -i deploy_key -p PORT USER@HOST "pwd"
```

Get the host key for `SSH_KNOWN_HOSTS`:

```bash
ssh-keyscan -p PORT HOST
```

Copy every line it prints.

## 3. GitHub secrets

In the repository on GitHub: **Settings → Secrets and variables → Actions →
New repository secret**. Add all six:

| Secret | What goes in it |
|---|---|
| `SSH_HOST` | The SSH host from the panel |
| `SSH_PORT` | The SSH port from the panel (`22` or `7822`) |
| `SSH_USER` | The SSH username |
| `SSH_PRIVATE_KEY` | The full contents of `deploy_key`, including the `BEGIN` and `END` lines |
| `SSH_KNOWN_HOSTS` | Every line `ssh-keyscan` printed |
| `DEPLOY_PATH` | Full path of the site folder, e.g. `/home/USERNAME/public_html`, with no slash at the end |

(The repo has no GitHub remote yet. Create one and push before this step.)

## 4. First deploy, by hand

1. Build and check:
   ```bash
   npm ci
   npm run build
   npm run check:export
   ```
   The last line must say `All checks passed.`
2. Zip the **contents** of `out/`, not the `out` folder itself. Open the zip
   and confirm `.htaccess`, `index` folders like `en/`, and `_next/` are at
   the top level.
   - Windows: open `out`, show hidden files, select everything
     (including `.htaccess`), right-click → *Compress to ZIP file*.
3. In the hosting **File Manager**, open the site folder and upload the zip.
4. Right-click the zip → **Extract**, into the site folder itself.
5. Delete the zip.
6. Open `https://charlesndirangu.com`. It should land on `/en/`.

## 5. Every deploy after that

- Push to `main`, or
- GitHub → **Actions → Deploy → Run workflow**.

The workflow installs, type-checks, builds, checks the export, uploads with
`rsync` (which removes files from old builds, including the old site's videos
and images), then runs a smoke test against the live site: all eight pages,
`robots.txt`, the sitemap, the manifest and the favicon return 200; `/` and a
sample of old routes each redirect once to the right page; a missing page
returns 404; the share image is served as `image/png`. If any step fails,
nothing after it runs.

If the smoke test fails, the new files are already live. Read its output, fix
the cause, and deploy again or roll back (section 6).

If the upload fails with `rsync: command not found` on the server side, tell
Claude. The fallback is `lftp` over SFTP with the same key.

## 6. Rolling back

GitHub → **Actions → Deploy → Run workflow**. Paste the SHA of an earlier good
commit into the **ref** box and run it. (Or open an earlier successful run
and click **Re-run all jobs**. That rebuilds that run's commit.)

## 7. Checking it's live

Paste these into a terminal (Git Bash on Windows). The expected result is in
the comment above each one.

```bash
S=charlesndirangu.com

# One 301 to https://charlesndirangu.com/en/
curl -sI http://$S/en/ | grep -iE '^(HTTP|location)'
# One 301 to https://charlesndirangu.com/en/ (no www)
curl -sI https://www.$S/en/ | grep -iE '^(HTTP|location)'
# One 301 to https://charlesndirangu.com/en/about/ (slash added)
curl -sI https://$S/en/about | grep -iE '^(HTTP|location)'

# The eight pages: all 200
for p in /en/ /en/work/ /en/about/ /en/contact/ /sw/ /sw/work/ /sw/about/ /sw/contact/; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' https://$S$p)" "$p"
done

# Every old route: prints "ok" when it is one 301 to the target beside it
check() {
  got=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "https://$S$1")
  [ "$got" = "301 https://$S$2" ] && r=ok || r="WRONG (got $got)"
  printf '%-40s -> %-14s %s\n' "$1" "$2" "$r"
}
check /                                    /en/
check /work                                /en/work/
check /about                               /en/about/
check /contact                             /en/contact/
check /projects                            /en/work/
check /projects/salio                      /en/work/
check /capabilities                        /en/work/
check /technologies                        /en/work/
check /philosophy                          /en/
check /writing                             /en/
check /writing/ai-integration-patterns     /en/
check /experience                          /en/about/
check /resume                              /en/about/
for l in en sw; do
  check /$l/projects                       /$l/work/
  check /$l/projects/salio                 /$l/work/
  check /$l/capabilities                   /$l/work/
  check /$l/technologies                   /$l/work/
  check /$l/philosophy                     /$l/
  check /$l/writing                        /$l/
  check /$l/writing/ai-integration-patterns /$l/
  check /$l/experience                     /$l/about/
  check /$l/resume                         /$l/about/
done
check /favicon.svg                         /icon.svg

# 404 status (not 200), with the site's own 404 page
curl -sI https://$S/does-not-exist/ | head -1

# All 200
for p in /robots.txt /sitemap.xml /manifest.webmanifest /favicon.ico /icon.svg /apple-icon.png /cv/charles-ndirangu-cv.pdf /me/chalo.jpg; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' https://$S$p)" "$p"
done
# The sitemap lists 8 pages
curl -s https://$S/sitemap.xml | grep -c '<loc>'

# Share image: 200 and Content-Type: image/png, in both languages
curl -sI https://$S/en/opengraph-image | grep -iE '^(HTTP|content-type)'
curl -sI https://$S/sw/opengraph-image | grep -iE '^(HTTP|content-type)'

# A hashed JS file: Cache-Control has "immutable"
JS=$(curl -s https://$S/en/ | grep -o '/_next/static/chunks/[^"]*\.js' | head -1)
curl -sI https://$S$JS | grep -i cache-control
# A page: Cache-Control: no-cache
curl -sI https://$S/en/ | grep -i cache-control
# The CV: Cache-Control: public, max-age=3600
curl -sI https://$S/cv/charles-ndirangu-cv.pdf | grep -i cache-control

# Security headers: all seven present
curl -sI https://$S/en/ | grep -iE '^(strict-transport-security|x-content-type-options|referrer-policy|x-frame-options|cross-origin-opener-policy|permissions-policy|content-security-policy)'
# Compression: Content-Encoding is br or gzip
curl -sI -H 'Accept-Encoding: br, gzip' https://$S/en/ | grep -i content-encoding
```

Then open the site in a browser and look, once per deploy:

- Home: the ID card on its lanyard appears and can be dragged.
- Press F12 and open the Console on Home and Contact. There should be no red
  "Content Security Policy" lines.
- Contact: the form opens your mail app; the WhatsApp link opens WhatsApp.
- Paste `https://charlesndirangu.com/en/` into
  <https://www.opengraph.xyz/> (or send it to yourself on WhatsApp) and
  check the preview card shows.

## 8. Security headers

All set in `public/.htaccess`, on every response:

| Header | Value | What it does |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000` | Browsers use HTTPS only, for a year |
| `X-Content-Type-Options` | `nosniff` | Files are used as the type the server states |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Other sites see the domain, not the page |
| `X-Frame-Options` | `DENY` | No other site can frame these pages |
| `Cross-Origin-Opener-Policy` | `same-origin` | A tab opened elsewhere cannot script this one |
| `Permissions-Policy` | camera, microphone, location and so on, all off | The site uses none of them |
| `Content-Security-Policy` | see below | Only this site's own files load |

The Content-Security-Policy allows files from this domain only. Each part is
explained in a comment above it in `public/.htaccess`. Three parts are looser
than the strictest possible policy, each for a reason:

- `script-src 'unsafe-inline'`: Next.js writes the theme script and the page
  data as inline scripts, and their text changes with every build. A static
  host cannot add a per-request nonce.
- `script-src 'wasm-unsafe-eval'`: the physics engine behind the 3D ID card
  is WebAssembly. This allows WebAssembly only, not `eval()`.
- `style-src 'unsafe-inline'`: React writes `style=""` attributes.

**If you add anything served from another domain** (analytics, an embedded
video or map, a web font from Google, a form service), the policy will block
it until you add that domain to the matching part of the
`Content-Security-Policy` line in `public/.htaccess`. The browser console
names the part that blocked it.

**If the policy ever breaks something**, delete the one
`Header always set Content-Security-Policy ...` line from `public/.htaccess`
and deploy. Nothing else depends on it.

A later, stricter step: replace `'unsafe-inline'` in `script-src` with a
`'sha256-...'` hash for each inline script, written into `.htaccess` by a
script that runs after the build. Not done now, because one wrong hash stops
the site from loading.

`Strict-Transport-Security` has no `includeSubDomains` and no `preload`. Add
them only when every subdomain you use is on HTTPS for good.
