# Generate Articles Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `/generate-articles N` Claude Code skill that generates N new SEO articles, rebuilds pagination, updates the sitemap, and pushes to git for automatic Cloudflare deployment.

**Architecture:** A single markdown skill file at `~/.claude/skills/generate-articles/SKILL.md`. Claude reads the skill instructions and executes them directly — no scripts, no external API calls. All logic is Claude reasoning over HTML files.

**Tech Stack:** Markdown (skill file), Static HTML, Git

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `~/.claude/skills/generate-articles/SKILL.md` | Create | Skill definition — all instructions Claude follows when `/generate-articles N` is invoked |

That's it. One file. The skill operates on the existing repo files (`articles/*.html`, `index.html`, `page-N.html`, `sitemap.xml`).

---

### Task 1: Create the Skill File

**Files:**
- Create: `~/.claude/skills/generate-articles/SKILL.md`

- [ ] **Step 1: Create the skills directory**

```bash
mkdir -p ~/.claude/skills/generate-articles
```

- [ ] **Step 2: Write the skill file**

Create `~/.claude/skills/generate-articles/SKILL.md` with this exact content:

````markdown
---
name: generate-articles
description: Use when the user runs /generate-articles N — generates N new SEO articles for the SmartBizAU site (tools.workswell.com.au), rebuilds pagination pages, updates sitemap.xml, and commits + pushes to git for automatic Cloudflare deployment. N must be a positive integer.
---

# Generate Articles

Generates N new SEO articles for SmartBizAU, rebuilds all pagination pages, updates the sitemap, commits and pushes to git. Cloudflare auto-deploys on push.

**Working directory:** The `smartbizau-site` git repository.

## Step 1 — Validate Input

Extract N from the invocation (e.g. `/generate-articles 5` → N = 5).

- If N is 0: abort. Say: "Nothing to do — specify at least 1 article."
- If N is not a positive integer: abort. Say: "Please provide a positive integer, e.g. `/generate-articles 5`."

## Step 2 — Discover Existing Articles

Scan `articles/*.html`. For each file, extract:
- **Slug**: filename without `.html` (e.g. `ai-invoice-generators-australia-gst-abn`)
- **Title**: text content of the `<h1>` tag
- **Date**: value of `datePublished` in the `<script type="application/ld+json">` block
- **Excerpt**: `content` attribute of `<meta name="description">`

Keep this list. Use it to avoid duplicate topics and to rebuild pagination.

## Step 3 — Generate N Articles

Invent N new long-tail keyword topics targeting Australian small business owners that are NOT already covered by existing articles. Write each as a complete HTML file and save to `articles/<slug>.html`.

**Topic requirements:**
- Long-tail keywords targeting Australian sole traders, small business owners, freelancers, or tradies
- Focused on AI tools, automation, or digital efficiency
- Not a duplicate or near-duplicate of any existing article title or topic

**Article quality requirements:**
- 600–900 words in the `<div class="article-body">`
- Multiple `<h2>` subheadings for scannability
- Australian context throughout: ABN, GST, BAS, ATO, prices in AUD
- Real tool names, practical advice — no fluff or generic AI hype
- End with a `<div class="cta-box">` cross-linking to a related article already on the site

**Use this HTML template exactly — do not deviate:**

```html
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{TITLE} | SmartBizAU</title>
  <meta name="description" content="{META_DESCRIPTION — max 160 characters}">
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
      <p><strong>{RELATED TOPIC HEADING}</strong></p>
      <p>{One sentence linking to a related article already on the site.}</p>
    </div>
  </div>
</main>

<footer class="site-footer">
  &copy; 2026 SmartBizAU. Built for Australian small business owners and freelancers.
</footer>

</body>
</html>
```

**Date rules:**
- `datePublished` (JSON-LD): today's date as `YYYY-MM-DD`
- `<p class="meta">` date: `Month DD, YYYY` format (e.g. "March 24, 2026")

**Read time:** total word count ÷ 200, rounded to nearest minute (minimum 1 min).

**Slug rules:** lowercase, hyphens only, no special characters, descriptive of the topic.

## Step 4 — Rebuild Pagination Pages

1. Compile the full article list: read slug, title, date, excerpt from every file in `articles/*.html` (old + new)
2. Sort by `datePublished` descending (newest first)
3. Tiebreaker for same date: alphabetical by slug (A→Z)
4. Split into pages of 5 articles each. The last page may have 1–5 articles.

**Stale page cleanup:**
- Check for existing `page-N.html` files in the repo root
- For any where N > new total page count: run `git rm page-N.html`

**Update `index.html` (page 1):**
Edit only the `<ul class="article-list">` and `<nav class="pagination">` blocks in-place. Leave all other content unchanged (head, hero, header, footer).

**Article list item format:**
```html
    <li>
      <h2><a href="/articles/{SLUG}.html">{TITLE}</a></h2>
      <p class="meta">{Month DD, YYYY} &middot; {N} min read</p>
      <p class="excerpt">{EXCERPT}</p>
    </li>
```

**Pagination nav rules:**
- Page 1: no Prev link; current page as `<span class="pagination-current" aria-current="page">1</span>`; links to all other pages; `<a href="/page-2.html" class="pagination-next">Next →</a>`
- Middle pages: `<a href="{PREV_URL}" class="pagination-prev">← Prev</a>`; all page links; current as span; `<a href="{NEXT_URL}" class="pagination-next">Next →</a>`
- Last page: Prev link; all page links; current as span; no Next link
- Page 1 URL = `/`, page N URL = `/page-N.html`
- Wrap in `<nav class="pagination" aria-label="Article pages">`

**Create/rewrite `page-N.html` files** (for N ≥ 2) using this template exactly:

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
{ARTICLE_LIST_ITEMS}
  </ul>
{PAGINATION_NAV}
</main>

<footer class="site-footer">
  &copy; 2026 SmartBizAU. Built for Australian small business owners and freelancers.
</footer>

</body>
</html>
```

## Step 5 — Update Sitemap

Rewrite `sitemap.xml` completely. Order:
1. Homepage `https://tools.workswell.com.au/` — priority 1.0
2. Pagination pages `https://tools.workswell.com.au/page-N.html` in ascending N order — priority 0.5
3. All articles in same sort order as pagination (newest first, slug tiebreaker) — priority 0.8

All `<lastmod>` values = today's date as `YYYY-MM-DD`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://tools.workswell.com.au/</loc><lastmod>{TODAY}</lastmod><priority>1.0</priority></url>
  <url><loc>https://tools.workswell.com.au/page-2.html</loc><lastmod>{TODAY}</lastmod><priority>0.5</priority></url>
  <!-- ... remaining pagination pages ... -->
  <url><loc>https://tools.workswell.com.au/articles/{SLUG}.html</loc><lastmod>{TODAY}</lastmod><priority>0.8</priority></url>
  <!-- ... remaining articles in sort order ... -->
</urlset>
```

## Step 6 — Commit and Push

```bash
git add articles/ index.html page-*.html sitemap.xml
git add -u
git commit -m "feat: add {N} articles ({YYYY-MM-DD})"
git push
```

Cloudflare auto-deploys on push. Done.
````

- [ ] **Step 3: Verify the file exists**

```bash
cat ~/.claude/skills/generate-articles/SKILL.md | head -5
```

Expected: frontmatter with `name: generate-articles` visible.

- [ ] **Step 4: Commit the skill file to the project repo for reference**

Copy the skill into the project so it's version-controlled alongside the site:

```bash
mkdir -p /Users/wx/Documents/projects/smartbizau-site/.claude/skills
cp ~/.claude/skills/generate-articles/SKILL.md /Users/wx/Documents/projects/smartbizau-site/.claude/skills/generate-articles.md
```

Then commit:

```bash
cd /Users/wx/Documents/projects/smartbizau-site
git add .claude/skills/generate-articles.md
git commit -m "feat: add generate-articles skill"
```

---

### Task 2: Smoke Test the Skill

Run the skill with N=2 and verify all outputs match the spec.

- [ ] **Step 1: Invoke the skill**

Run `/generate-articles 2` in a new Claude Code session in the `smartbizau-site` repo.

- [ ] **Step 2: Verify 2 new article files were created**

```bash
ls -lt articles/ | head -5
```

Expected: 2 new `.html` files at the top of the listing (newest first).

- [ ] **Step 3: Verify article HTML structure**

Open one of the new article files and confirm:
- `lang="en-AU"` on `<html>`
- `<link rel="canonical">` present with correct URL
- `<script type="application/ld+json">` with `"@type": "Article"` and today's `datePublished`
- `<div class="article-body">` has content with at least one `<h2>`
- `<div class="cta-box">` present at end of body
- Word count roughly 600–900 words

- [ ] **Step 4: Verify index.html was updated**

```bash
grep -c "<li>" index.html
```

Expected: 5 (still 5 articles on page 1 — new articles push to a new or existing later page).

Check the pagination nav in `index.html` reflects the new total page count.

- [ ] **Step 5: Verify sitemap.xml is complete**

```bash
grep -c "<url>" sitemap.xml
```

Expected: previous count + 2 new articles (+ any new pagination pages).

Also verify the homepage and pagination pages are present and article URLs use the correct slugs.

- [ ] **Step 6: Verify the git push happened**

```bash
git log --oneline -3
git status
```

Expected: clean working tree, latest commit message matches `feat: add 2 articles (YYYY-MM-DD)`, and the commit should be pushed (no "ahead of origin" message).

---

## Quick Reference

| When skill is invoked | What changes |
|-----------------------|--------------|
| `/generate-articles 5` | 5 new `articles/*.html` files, updated `index.html` + `page-N.html` files, updated `sitemap.xml`, new git commit pushed |

**Spec:** `docs/superpowers/specs/2026-03-24-generate-articles-skill-design.md`
