# Pagination Design — SmartBizAU Homepage

**Date:** 2026-03-23
**Status:** Approved

## Overview

Add pagination to the SmartBizAU homepage article list. Currently all 15 articles are listed on `index.html`. We will split them across 3 static HTML pages with 5 articles per page.

## Approach

Static multi-page HTML (no JavaScript). Each page is a standalone `.html` file with hardcoded article entries and a pagination nav at the bottom.

## Pages

| File | Articles | Canonical URL |
|---|---|---|
| `index.html` | 1–5 | `https://tools.workswell.com.au/` |
| `page-2.html` | 6–10 | `https://tools.workswell.com.au/page-2.html` |
| `page-3.html` | 11–15 | `https://tools.workswell.com.au/page-3.html` |

## Article Order

Articles remain in their current order (newest first as they appear in `index.html`):

- Page 1: articles 1–5
- Page 2: articles 6–10
- Page 3: articles 11–15

## Page Structure

Each page copies the full `index.html` structure (header, hero, article list, footer). The `.hero` block is included on all three pages for branding consistency. The article `<ul>` retains `id="articles"` on all pages so the `Guides` header nav link works correctly.

## `<title>` and OG Metadata

| Page | `<title>` | `og:title` |
|---|---|---|
| `index.html` | SmartBizAU - AI Tools and Automation for Australian Small Business | (unchanged) |
| `page-2.html` | SmartBizAU - Page 2 | SmartBizAU - AI Tools for Australian Small Business - Page 2 |
| `page-3.html` | SmartBizAU - Page 3 | SmartBizAU - AI Tools for Australian Small Business - Page 3 |

`og:description` on pages 2 and 3 matches the base description on `index.html`. `og:type` remains `website`.

## Pagination Nav

Placed below the article list, inside `<main>`. Each page has its own hardcoded nav — prev/next links are **omitted entirely** (not CSS-hidden) when they do not apply, so screen readers and crawlers never encounter them.

`aria-current="page"` is set on the current page span.

**Page 1 nav:**
```html
<nav class="pagination" aria-label="Article pages">
  <span class="pagination-current" aria-current="page">1</span>
  <a href="/page-2.html">2</a>
  <a href="/page-3.html">3</a>
  <a href="/page-2.html" class="pagination-next">Next →</a>
</nav>
```

**Page 2 nav:**
```html
<nav class="pagination" aria-label="Article pages">
  <a href="/" class="pagination-prev">← Prev</a>
  <a href="/">1</a>
  <span class="pagination-current" aria-current="page">2</span>
  <a href="/page-3.html">3</a>
  <a href="/page-3.html" class="pagination-next">Next →</a>
</nav>
```

**Page 3 nav:**
```html
<nav class="pagination" aria-label="Article pages">
  <a href="/page-2.html" class="pagination-prev">← Prev</a>
  <a href="/">1</a>
  <a href="/page-2.html">2</a>
  <span class="pagination-current" aria-current="page">3</span>
</nav>
```

## CSS

New `.pagination` block added to `css/style.css` using existing CSS variables:

```css
.pagination {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  font-size: 0.95rem;
}
.pagination a { color: var(--accent); }
.pagination-current { font-weight: 700; color: var(--text); }
```

## SEO

- Each page has `<link rel="canonical">` pointing to itself.
- `rel="prev"` / `rel="next"` link elements are **out of scope** — Google deprecated these for ranking in 2019 and the site does not target other crawlers that rely on them.
- Sitemap updated to include `page-2.html` and `page-3.html` with `priority="0.5"` (lower than homepage `1.0` and articles `0.8`) and `lastmod` matching today's date.

## Out of Scope

- Dynamic/JS pagination
- `rel="prev"` / `rel="next"` link elements
- Category filtering
- Search
