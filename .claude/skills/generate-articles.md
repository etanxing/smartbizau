---
name: generate-articles
description: Use when the user runs /generate-articles N — generates N new SEO articles for the workswell site (tools.workswell.com.au), rebuilds pagination pages, and updates sitemap.xml. N must be a positive integer.
---

# Generate Articles

Generates N new SEO articles for workswell, rebuilds all pagination pages, updates the sitemap. Does NOT commit or push — files are left staged for the user to review.

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

## Step 3 — Research Current AI Tool Trends

Before picking topics, run the following searches to ground articles in real, current tools and user pain points. Skim results for: recently released tools, specific pain points Australian small business owners mention, and any AI features launched in the last 3 months.

**Run these searches (use WebSearch):**
1. `new AI tools Australian small business 2026`
2. `AI tools sole trader freelancer Australia reddit`
3. `"The Rundown AI" OR "Ben's Bites" AI tools small business site:rundown.ai OR bensbites.co`
4. `site:reddit.com/r/AusFinance OR site:reddit.com/r/smallbusiness AI tools invoicing payroll BAS`
5. One search specific to a gap in existing coverage (e.g. if no article covers tradies + scheduling, search `AI scheduling tools tradies Australia`)

**From the results, extract a shortlist of candidate topics:**
- Tool names that are real and currently available
- Pain points that appear repeatedly (same complaint = real demand)
- Any Australian-specific angle (ATO integration, ABN lookup, GST handling, Xero/MYOB compatibility)

Discard: US-only tools, vague "AI will transform X" content, anything already covered by existing articles.

**If searches return no useful results** (paywalled, blocked, empty): fall back to generating topics from training knowledge, noting "Web research unavailable" in the generation notes.

## Step 4 — Generate N Articles

Pick N topics from the research shortlist (or from training knowledge if research failed). Prioritise topics that are:
1. Grounded in a specific real tool or workflow
2. Narrowly targeted (one task, one audience)
3. Not a duplicate or near-duplicate of any existing article

Write each as a complete HTML file and save to `articles/<slug>.html`.

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

**Content format — choose the best fit for the topic:**

| Article type | Best format |
|---|---|
| Tool comparison (A vs B vs C) | Comparison `<table>` + short prose per section |
| How-to / tutorial | Numbered `<ol>` steps; add `<pre><code>` for any CLI/API/config content |
| Tool roundup (top 5 tools) | `<h2>` per tool + brief description; optional summary table at the end |
| Explainer / guide | Prose + `<blockquote>` for key stats or ATO quotes |
| Technical setup | `<pre><code>` blocks with realistic example values (API keys redacted as `YOUR_KEY`) |

**Comparison table format:**
```html
<table>
  <thead>
    <tr><th>Tool</th><th>AUD Pricing</th><th>Xero Integration</th><th>Best For</th></tr>
  </thead>
  <tbody>
    <tr><td>Tool A</td><td>$X/mo</td><td>Yes</td><td>Sole traders</td></tr>
    <tr><td>Tool B</td><td>$Y/mo</td><td>Partial</td><td>Teams</td></tr>
  </tbody>
</table>
```

**Code block format** (use for CLI commands, API calls, config snippets):
```html
<pre><code>curl -X POST https://api.example.com/invoice \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"amount": 1100, "gst": true}'</code></pre>
```

**Blockquote format** (use for ATO guidance, key stats, direct quotes):
```html
<blockquote>
  <p>"Businesses with under $10M turnover can use simplified GST accounting methods." — ATO</p>
</blockquote>
```

**Images:** Only include an `<img>` if you have a real, publicly accessible URL. Do not use placeholder URLs. If you don't have a real image URL, skip images entirely — a text article is better than broken images.

**Use this HTML template exactly — do not deviate:**

```html
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{TITLE} | workswell</title>
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
    "author": {"@type": "Organization", "name": "workswell"}
  }
  </script>
</head>
<body>

<header class="site-header">
  <div class="inner">
    <a href="/" class="logo">workswell</a>
    <nav><a href="/">Home</a><a href="/#articles">Guides</a></nav>
  </div>
</header>

<main class="container">
  <div class="article-header">
    <h1>{TITLE}</h1>
    <p class="meta">{Month DD, YYYY} &middot; {READ_TIME} min read</p>
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
  &copy; 2026 workswell. Built for Australian small business owners and freelancers.
</footer>

</body>
</html>
```

**Date rules:**
- `datePublished` (JSON-LD): today's date as `YYYY-MM-DD`
- `<p class="meta">` date: `Month DD, YYYY` format (e.g. "March 24, 2026")

**Read time:** total word count ÷ 200, rounded to nearest minute (minimum 1 min).

**Slug rules:** lowercase, hyphens only, no special characters, descriptive of the topic.

## Step 5 — Write Generation Notes

For each article generated in Step 3, create a companion file `articles/<slug>.txt` with the following content:

```
Article: {SLUG}.html
Generated: {YYYY-MM-DD}
Topic keyword: {THE LONG-TAIL KEYWORD THIS ARTICLE TARGETS}
Why chosen: {One sentence explaining why this topic was selected — gap in existing coverage, keyword opportunity, etc.}
Sources consulted: {List specific references used — ATO pages, ASIC docs, tool documentation, Reddit threads, newsletter items, etc. If web research was unavailable, write "General knowledge — Australian small business AI tools context"}
Content approach: {One sentence describing the angle taken — e.g. "Comparison format with table", "How-to guide with code blocks", "Explainer with blockquotes", "Tool roundup with summary table"}
Content formats used: {List elements used beyond plain prose — e.g. "comparison table", "code blocks", "blockquote", "numbered steps", "none (prose only)"}
Related articles linked: {Slug(s) of the article(s) referenced in the CTA box}
```

Save one `.txt` per article. These files are for human review and are not deployed.

## Step 6 — Rebuild Pagination Pages

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
      <p class="meta">{Month DD, YYYY} &middot; {READ_TIME} min read</p>
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
  <title>workswell - Page {N}</title>
  <meta name="description" content="Practical guides on using AI tools to save time and money for Australian small businesses, freelancers, and sole traders.">
  <meta name="robots" content="index, follow">
  <meta name="google-site-verification" content="J-lIb95Na1n-22m5Fvz7U8FnxNuumGC6ErueVpvU5yY" />
  <link rel="canonical" href="https://tools.workswell.com.au/page-{N}.html">
  <meta property="og:title" content="workswell - AI Tools for Australian Small Business - Page {N}">
  <meta property="og:description" content="Practical guides on using AI tools to save time and money for Australian small businesses.">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="/css/style.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "workswell",
    "url": "https://tools.workswell.com.au",
    "description": "AI tools and automation guides for Australian small businesses"
  }
  </script>
</head>
<body>

<header class="site-header">
  <div class="inner">
    <a href="/" class="logo">workswell</a>
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
  &copy; 2026 workswell. Built for Australian small business owners and freelancers.
</footer>

</body>
</html>
```

## Step 7 — Update Sitemap

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

Done. All files are written but not staged or committed — the user reviews and commits manually.
