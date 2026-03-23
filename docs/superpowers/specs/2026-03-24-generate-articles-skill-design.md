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

## Input Validation

Before doing anything else:
- If N is 0: abort with message "Nothing to do — specify at least 1 article."
- If N is not a positive integer: abort with message "Please provide a positive integer, e.g. `/generate-articles 5`."

---

## Step-by-Step Behaviour

### Step 1 — Discover Existing Articles

Scan `articles/*.html`. For each file, extract:
- Slug (from filename, e.g. `ai-invoice-generators-australia-gst-abn`)
- Title (from `<h1>` tag)
- Date (from schema.org `datePublished` field in the JSON-LD script block)
- Excerpt (from `<meta name="description">` content attribute)

This list is used to:
1. Avoid duplicate topics when generating new articles
2. Build the full article list for pagination and sitemap

### Step 2 — Generate N Articles

Claude invents N new long-tail keyword topics targeting Australian small business owners, not already covered by existing articles. For each:

- Choose a topic and derive a URL-friendly slug (lowercase, hyphens, no special characters)
- Write a complete HTML file matching the template below exactly
- Save to `articles/<slug>.html`

**Article quality requirements:**
- Australian context throughout (ABN, GST, BAS, ATO, AUD prices where relevant)
- Practical, specific — real tool names and actionable advice
- No fluff or AI hype — matches the site's editorial tone
- 600–900 words in the article body
- Multiple `<h2>` subheadings for scannability
- End with a `<div class="cta-box">` pointing to a related article on the site

**Article HTML template:**

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
    {CONTENT WITH H2 SUBHEADINGS}

    <div class="cta-box">
      <p><strong>{RELATED TOPIC CTA}</strong></p>
      <p>{ONE SENTENCE pointing to a related article on the site.}</p>
    </div>
  </div>
</main>

<footer class="site-footer">
  &copy; 2026 SmartBizAU. Built for Australian small business owners and freelancers.
</footer>

</body>
</html>
```

Notes:
- `datePublished`: today's date in `YYYY-MM-DD` format
- Read time: estimate from word count at ~200 wpm, round to nearest minute
- Nav uses the compact single-line format (no whitespace between `<a>` tags) as shown above

### Step 3 — Rebuild Pagination Pages

After generating new articles, compile the full article list:
1. Read all articles from `articles/*.html` (existing + newly created)
2. Sort by `datePublished` descending (newest first)
3. **Tiebreaker for same date:** sort alphabetically by slug (A→Z). This ensures the order is stable and deterministic across multiple runs on the same day.
4. Split into pages of 5 articles each. The last page may contain 1–5 articles.

**Stale page detection:**
- Before rewriting, glob for all existing `page-N.html` files in the repo root
- After computing the new page count, delete any `page-N.html` where N > new page count using `git rm`

**For `index.html` (page 1):**
Rewrite only the `<ul class="article-list">` and `<nav class="pagination">` blocks in-place. Leave all other content (hero, header, footer, meta tags) unchanged.

**For page-2.html, page-3.html, etc.:**
Rewrite the entire file using the pagination page template below. Create new page files as needed.

**Pagination page HTML template:**

```html
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SmartBizAU - Page {N}</title>
  <meta name="description" content="Practical guides on using AI tools to save time and money for Australian small businesses, freelancers, and sole traders.">
  <meta name="robots" content="index, follow">
  <meta name="google-site-verification" content="J-lIb95Na1n-22m5Fvz7U8FnxNuumGC6ErueVpvU5yY" />
  <link rel="canonical" href="https://tools.workswell.com.au/page-{N}.html">
  <meta property="og:title" content="SmartBizAU - AI Tools for Australian Small Business - Page {N}">
  <meta property="og:description" content="Practical guides on using AI tools to save time and money for Australian small businesses.">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="/css/style.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SmartBizAU",
    "url": "https://tools.workswell.com.au",
    "description": "AI tools and automation guides for Australian small businesses"
  }
  </script>
</head>
<body>

<header class="site-header">
  <div class="inner">
    <a href="/" class="logo">SmartBizAU</a>
    <nav>
      <a href="/">Home</a>
      <a href="#articles">Guides</a>
    </nav>
  </div>
</header>

<main class="container">
  <div class="hero">
    <h1>AI Tools That Actually Work for Australian Small Business</h1>
    <p>No hype, just practical guides. We test AI tools and show you how to use them to save hours every week on invoicing, bookkeeping, marketing, and more.</p>
  </div>

  <ul class="article-list" id="articles">
    {ARTICLE LIST ITEMS}
  </ul>
  {PAGINATION NAV}
</main>

<footer class="site-footer">
  &copy; 2026 SmartBizAU. Built for Australian small business owners and freelancers.
</footer>

</body>
</html>
```

**Article list item format:**
```html
    <li>
      <h2><a href="/articles/{SLUG}.html">{TITLE}</a></h2>
      <p class="meta">{Month DD, YYYY} &middot; {N} min read</p>
      <p class="excerpt">{EXCERPT}</p>
    </li>
```

**Pagination nav format** (adapt links based on current page and total pages):
```html
  <nav class="pagination" aria-label="Article pages">
    <!-- On page 1: no Prev link, current=1, next links -->
    <span class="pagination-current" aria-current="page">1</span>
    <a href="/page-2.html">2</a>
    <a href="/page-3.html">3</a>
    <a href="/page-2.html" class="pagination-next">Next →</a>

    <!-- On middle pages: prev, numbered links, next -->
    <a href="/" class="pagination-prev">← Prev</a>
    <a href="/">1</a>
    <span class="pagination-current" aria-current="page">2</span>
    <a href="/page-3.html">3</a>
    <a href="/page-3.html" class="pagination-next">Next →</a>

    <!-- On last page: prev, numbered links, no Next -->
    <a href="/page-2.html" class="pagination-prev">← Prev</a>
    <a href="/">1</a>
    <a href="/page-2.html">2</a>
    <span class="pagination-current" aria-current="page">3</span>
  </nav>
```

### Step 4 — Update Sitemap

Rewrite `sitemap.xml` with all URLs in this order:
1. Homepage (`/`) — priority 1.0
2. Pagination pages (`/page-2.html`, `/page-3.html`, …) — priority 0.5, in page number order
3. All articles — priority 0.8, in the same sort order as pagination (newest first, then alphabetical by slug as tiebreaker)

All `<lastmod>` values set to today's date (`YYYY-MM-DD`).

### Step 5 — Commit and Push

Stage all changes including deletions:
```bash
git add articles/ index.html page-*.html sitemap.xml
git add -u  # stages any deleted page-N.html files
```

Commit message format:
```
feat: add N articles (YYYY-MM-DD)
```

Then `git push`. Cloudflare auto-deploys on push.

---

## File Changes Per Run

| File | Action |
|------|--------|
| `articles/<slug>.html` | Created (N new files) |
| `index.html` | Article list + pagination nav rewritten in-place |
| `page-2.html` … `page-N.html` | Rewritten or created |
| Stale `page-N.html` | Deleted via `git rm` |
| `sitemap.xml` | Fully rewritten |

---

## Constraints

| Constraint | Value |
|------------|-------|
| Articles per page | 5 (last page may have 1–5) |
| Canonical base URL | `https://tools.workswell.com.au` |
| Date in article meta | `Month DD, YYYY` (e.g. "March 24, 2026") |
| Date in schema.org | `YYYY-MM-DD` |
| Read time estimation | word count ÷ 200, rounded to nearest minute |
| Article body length | 600–900 words |
| Sort order | Newest date first; alphabetical by slug as tiebreaker |
| Google verification tag | `J-lIb95Na1n-22m5Fvz7U8FnxNuumGC6ErueVpvU5yY` |
