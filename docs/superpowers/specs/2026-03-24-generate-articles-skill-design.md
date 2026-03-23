# Design: `/generate-articles` Skill

**Date:** 2026-03-24
**Status:** Approved

---

## Overview

A manually-invoked Claude Code skill that generates N new SEO articles, rebuilds pagination pages, updates the sitemap, and pushes to git — triggering automatic Cloudflare deployment.

**Invocation:**
```
/generate-articles 5
```

---

## Goals

- Let the user grow the article count on demand without manual writing
- Keep all static files (articles, pages, sitemap) consistent after each run
- Zero external dependencies — Claude writes files directly, no API calls or build scripts

---

## Non-Goals

- Automated/scheduled execution (this is manual-trigger only)
- Topic management file or manifest — HTML files are the source of truth
- Dry-run or review step before push — fully hands-off

---

## Step-by-Step Behaviour

### Step 1 — Discover Existing Articles

Scan `articles/*.html`. For each file, extract:
- Slug (from filename, e.g. `ai-invoice-generators-australia-gst-abn`)
- Title (from `<h1>` or `<title>` tag)
- Date (from schema.org `datePublished` or `<p class="meta">`)
- Excerpt (from `<meta name="description">`)

This list is used to avoid duplicate topics and to rebuild pagination.

### Step 2 — Generate N Articles

Claude invents N new long-tail keyword topics targeting Australian small business owners, not already covered by existing articles. For each:

- Choose a topic and derive a URL-friendly slug
- Write a complete HTML file matching the site template exactly:
  - `<!DOCTYPE html>`, `lang="en-AU"`
  - `<title>`, `<meta name="description">`, `<meta name="robots">`, canonical URL
  - Schema.org `Article` JSON-LD with `datePublished` (today), `headline`, `author`
  - Site header with logo + nav
  - `<div class="article-header">` with `<h1>` and `<p class="meta">` (date + read time)
  - `<div class="article-body">` with 600–900 words, multiple `<h2>` subheadings, practical Australian-specific content
  - Site footer
  - `<link rel="stylesheet" href="/css/style.css">`
- Save to `articles/<slug>.html`

**Article quality requirements:**
- Australian context throughout (ABN, GST, BAS, ATO, AUD prices where relevant)
- Practical, specific — real tool names and actionable advice
- No fluff or AI hype — matches the site's editorial tone

### Step 3 — Rebuild Pagination Pages

After generating new articles, read the full `articles/` directory. Sort all articles by date descending (newest first). Split into pages of 5 articles each.

For each page:
- Page 1 → `index.html` (article list section only; preserve hero, header, footer)
- Page N → `page-N.html`

Each page includes:
- An `<ul class="article-list">` with 5 `<li>` entries (title link, meta, excerpt)
- A `<nav class="pagination">` with prev/next links and page number links

Delete any stale `page-N.html` files that are no longer needed if the total page count decreases.

### Step 4 — Update Sitemap

Rewrite `sitemap.xml` with:
- Homepage (`/`) — priority 1.0
- Pagination pages (`/page-2.html`, `/page-3.html`, etc.) — priority 0.5
- All article URLs — priority 0.8
- `lastmod` set to today's date for all entries

### Step 5 — Commit and Push

Stage specific files only:
```
git add articles/ index.html page-*.html sitemap.xml
```

Commit message format:
```
feat: add N articles (YYYY-MM-DD)
```

Then `git push`. Cloudflare auto-deploys on push.

---

## Article HTML Template

```html
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{TITLE} | SmartBizAU</title>
  <meta name="description" content="{META_DESCRIPTION}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://tools.workswell.com.au/articles/{SLUG}.html">
  <link rel="stylesheet" href="/css/style.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{TITLE}",
    "datePublished": "{YYYY-MM-DD}",
    "author": {"@type": "Organization", "name": "SmartBizAU"}
  }
  </script>
</head>
<body>

<header class="site-header">
  <div class="inner">
    <a href="/" class="logo">SmartBizAU</a>
    <nav><a href="/">Home</a><a href="/#articles">Guides</a></nav>
  </div>
</header>

<main class="container">
  <div class="article-header">
    <h1>{TITLE}</h1>
    <p class="meta">{Month DD, YYYY} &middot; {N} min read</p>
  </div>

  <div class="article-body">
    {CONTENT}
  </div>
</main>

<footer class="site-footer">
  &copy; 2026 SmartBizAU. Built for Australian small business owners and freelancers.
</footer>

</body>
</html>
```

---

## File Changes Per Run

| File | Action |
|------|--------|
| `articles/<slug>.html` | Created (N new files) |
| `index.html` | Article list + pagination rewritten |
| `page-2.html` … `page-N.html` | Rewritten or created |
| `sitemap.xml` | Fully rewritten |

---

## Constraints

- 5 articles per page (matches current site)
- Canonical base URL: `https://tools.workswell.com.au`
- Date format in meta: `Month DD, YYYY` (e.g. "March 24, 2026")
- Date format in schema.org: `YYYY-MM-DD`
- Read time: estimate from word count (~200 wpm), round to nearest minute
