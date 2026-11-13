# Deploying the site

The site is a **static export**. `npm run build` writes plain files into `out/`.
hosting.com serves those files. Nothing runs on the server, so you don't need Node.js there.

- Live site: `https://charlesndirangu.com` (bare domain, no `www`)
- Deploy branch: `main`. To change it, edit `branches: [main]` near the top of
  `.github/workflows/deploy.yml`.
- Redirects and cache headers live in `public/.htaccess`, not `next.config.ts`.

> **Before your first automatic deploy:** the Workbench redesign is on the
> `workbench` branch. Merge it into `main` (or change the deploy branch) when
> you're ready: a push to `main` deploys.

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
`rsync` (which removes files from old builds), then checks that `/en/` and
`/sw/` return 200 and `/` redirects to `/en/`. If any step fails, nothing
after it runs.

If the upload fails with `rsync: command not found` on the server side, tell
Claude. The fallback is `lftp` over SFTP with the same key.

## 6. Rolling back

GitHub → **Actions → Deploy → Run workflow**. Paste the SHA of an earlier good
commit into the **ref** box and run it. (Or open an earlier successful run
and click **Re-run all jobs**. That rebuilds that run's commit.)

## 7. Checking it's live

Paste these into a terminal. Expected results are in the comments.

```bash
S=charlesndirangu.com

# One 301 to https
curl -sI http://$S/en/ | grep -iE '^(HTTP|location)'
# One 301 to the bare domain
curl -sI https://www.$S/en/ | grep -iE '^(HTTP|location)'
# 301 to /en/
curl -sI https://$S/ | grep -iE '^(HTTP|location)'
# Each old path: one 301 to its new /en/ page (Work, About or Home)
for p in projects philosophy about capabilities technologies experience writing resume contact projects/salio writing/ai-integration-patterns; do
  printf '%-34s ' "/$p"; curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://$S/$p
done
# No trailing slash: 301 to /en/about/
curl -sI https://$S/en/about | grep -iE '^(HTTP|location)'
# Every page in both locales: all 200
for u in $(curl -s https://$S/sitemap.xml | grep -o '<loc>[^<]*' | sed 's/<loc>//'); do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' $u)" "$u"
done | sort | uniq -c -w3
# 404 status (not 200), with the site's 404 page
curl -sI https://$S/does-not-exist/ | head -1
# OG image: 200 and Content-Type: image/png
curl -sI https://$S/en/opengraph-image | grep -iE '^(HTTP|content-type)'
# A hashed JS file: Cache-Control has "immutable"
JS=$(curl -s https://$S/en/ | grep -o '/_next/static/chunks/[^"]*\.js' | head -1)
curl -sI https://$S$JS | grep -i cache-control
# A page: Cache-Control: no-cache
curl -sI https://$S/en/ | grep -i cache-control
# Both 200
curl -s -o /dev/null -w '%{http_code} sitemap\n' https://$S/sitemap.xml
curl -s -o /dev/null -w '%{http_code} robots\n' https://$S/robots.txt
```
