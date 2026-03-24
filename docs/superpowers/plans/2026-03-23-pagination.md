# Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the 15-article homepage into 3 paginated static HTML pages (5 articles each) with accessible pagination navigation.

**Architecture:** Pure static HTML — no JavaScript, no build system. Three standalone HTML files (`index.html`, `page-2.html`, `page-3.html`) each containing 5 hardcoded articles and a page-specific nav. CSS added to the existing stylesheet.

**Tech Stack:** HTML5, CSS3 (existing `css/style.css` with CSS custom properties)

---

## File Map

| Action | File | Change |
|---|---|---|
| Modify | `index.html` | Remove articles 6–15, add page 1 pagination nav |
| Create | `page-2.html` | Articles 6–10 + page 2 pagination nav |
| Create | `page-3.html` | Articles 11–15 + page 3 pagination nav |
| Modify | `css/style.css` | Add `.pagination` CSS block |
| Modify | `sitemap.xml` | Add entries for page-2.html and page-3.html |

---

## Task 1: Add pagination CSS

**Files:**
- Modify: `css/style.css` (after `.article-list .excerpt` block, before `/* Article page */`)

- [ ] **Step 1: Add `.pagination` styles to `css/style.css`**

Append this block after the `.article-list .excerpt` rule (around line 99), before `/* Article page */`:

```css
/* Pagination */
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

- [ ] **Step 2: Commit**

```bash
git add css/style.css
git commit -m "feat: add pagination CSS"
```

---

## Task 2: Update index.html — articles 1–5 + page 1 nav

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Remove articles 6–15 from `index.html`**

In `index.html`, delete the `<li>` blocks for these 10 articles (lines ~69–118):
- ai-tax-deductions-australia-small-business.html
- ai-payroll-tools-australian-small-business.html
- ai-business-plan-australia-guide.html
- ai-contract-review-tools-australia.html
- ai-tools-ecommerce-australia-gst.html
- ai-cash-flow-forecasting-australia.html
- ai-customer-service-tools-australia.html
- ai-tools-tradies-contractors-australia.html
- ai-superannuation-tools-small-business-australia.html
- ai-insurance-comparison-small-business-australia.html

The `<ul class="article-list" id="articles">` should contain exactly 5 `<li>` items after this edit.

- [ ] **Step 2: Add page 1 pagination nav after the `</ul>` closing tag**

```html
  <nav class="pagination" aria-label="Article pages">
    <span class="pagination-current" aria-current="page">1</span>
    <a href="/page-2.html">2</a>
    <a href="/page-3.html">3</a>
    <a href="/page-2.html" class="pagination-next">Next →</a>
  </nav>
```

Place this between `</ul>` and `</main>`.

- [ ] **Step 3: Verify `index.html` structure**

Open `index.html` in a browser (or inspect the source). Confirm:
- Exactly 5 article list items visible
- Pagination nav shows: `1  2  3  Next →`
- "1" is bold (current page), "2" and "3" are blue links
- No Prev arrow present

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: trim index.html to 5 articles, add page 1 pagination nav"
```

---

## Task 3: Create page-2.html — articles 6–10 + page 2 nav

**Files:**
- Create: `page-2.html`

- [ ] **Step 1: Create `page-2.html`**

Copy the full structure of `index.html` as a starting point, then make these changes:

**`<title>`:** `workswell - Page 2`

**`og:title`:** `workswell - AI Tools for Australian Small Business - Page 2`

**`og:description`:** `Practical guides on using AI tools to save time and money for Australian small businesses.`

**`<link rel="canonical">`:** `https://tools.workswell.com.au/page-2.html`

**Article list** — replace the 5 articles with these (taken from the original `index.html` articles 6–10):

```html
<li>
  <h2><a href="/articles/ai-tax-deductions-australia-small-business.html">How AI Can Help Australian Small Businesses Maximise Tax Deductions</a></h2>
  <p class="meta">March 23, 2026 &middot; 8 min read</p>
  <p class="excerpt">Many Australian sole traders miss out on thousands of dollars in legitimate deductions each year. AI tools can now scan your expenses, flag deductible items, and keep you ATO-compliant year-round.</p>
</li>
<li>
  <h2><a href="/articles/ai-payroll-tools-australian-small-business.html">Best AI Payroll Tools for Australian Small Businesses in 2026</a></h2>
  <p class="meta">March 23, 2026 &middot; 8 min read</p>
  <p class="excerpt">Managing payroll with Single Touch Payroll, super obligations, and award rates is complex. These AI-powered tools take the stress out of paying your staff correctly every time.</p>
</li>
<li>
  <h2><a href="/articles/ai-business-plan-australia-guide.html">How to Write a Business Plan Using AI: A Guide for Australians</a></h2>
  <p class="meta">March 23, 2026 &middot; 7 min read</p>
  <p class="excerpt">Whether you need a plan for a bank loan, a government grant, or just to get your own ideas straight, AI tools can do most of the heavy lifting. Here is how to do it right.</p>
</li>
<li>
  <h2><a href="/articles/ai-contract-review-tools-australia.html">AI Contract Review Tools for Australian Small Businesses: Are They Worth It?</a></h2>
  <p class="meta">March 23, 2026 &middot; 9 min read</p>
  <p class="excerpt">Legal fees add up fast. AI contract review tools can flag risky clauses, summarise obligations, and help you understand what you are signing before you call a solicitor.</p>
</li>
<li>
  <h2><a href="/articles/ai-tools-ecommerce-australia-gst.html">AI Tools for Australian eCommerce Businesses: GST, Shipping, and Customer Service</a></h2>
  <p class="meta">March 23, 2026 &middot; 8 min read</p>
  <p class="excerpt">Running an online store in Australia means managing GST on digital goods, complex shipping rules, and customer queries at all hours. AI tools can handle all three.</p>
</li>
```

**Pagination nav** — replace the page 1 nav with:

```html
<nav class="pagination" aria-label="Article pages">
  <a href="/" class="pagination-prev">← Prev</a>
  <a href="/">1</a>
  <span class="pagination-current" aria-current="page">2</span>
  <a href="/page-3.html">3</a>
  <a href="/page-3.html" class="pagination-next">Next →</a>
</nav>
```

- [ ] **Step 2: Verify `page-2.html` structure**

Open in browser. Confirm:
- Exactly 5 articles visible (tax deductions through eCommerce)
- Pagination nav shows: `← Prev  1  2  3  Next →`
- "2" is bold, others are links
- Clicking "← Prev" goes to `/` (index.html)
- Clicking "Next →" goes to `/page-3.html`

- [ ] **Step 3: Commit**

```bash
git add page-2.html
git commit -m "feat: create page-2.html with articles 6-10 and pagination nav"
```

---

## Task 4: Create page-3.html — articles 11–15 + page 3 nav

**Files:**
- Create: `page-3.html`

- [ ] **Step 1: Create `page-3.html`**

Copy `page-2.html` as a starting point, then make these changes:

**`<title>`:** `workswell - Page 3`

**`og:title`:** `workswell - AI Tools for Australian Small Business - Page 3`

**`<link rel="canonical">`:** `https://tools.workswell.com.au/page-3.html`

**Article list** — replace with articles 11–15:

```html
<li>
  <h2><a href="/articles/ai-cash-flow-forecasting-australia.html">Using AI for Cash Flow Forecasting in Your Australian Small Business</a></h2>
  <p class="meta">March 23, 2026 &middot; 7 min read</p>
  <p class="excerpt">Cash flow problems are the number one reason Australian small businesses fail. AI forecasting tools can show you what is coming weeks ahead so you can act before it is too late.</p>
</li>
<li>
  <h2><a href="/articles/ai-customer-service-tools-australia.html">AI Customer Service Tools for Australian Small Businesses: Chatbots That Actually Help</a></h2>
  <p class="meta">March 23, 2026 &middot; 7 min read</p>
  <p class="excerpt">Responding to customer enquiries outside business hours used to mean hiring staff. These AI tools handle common questions, book appointments, and escalate complex issues automatically.</p>
</li>
<li>
  <h2><a href="/articles/ai-tools-tradies-contractors-australia.html">AI Tools for Tradies and Contractors in Australia: Quotes, Scheduling, and Invoicing</a></h2>
  <p class="meta">March 23, 2026 &middot; 8 min read</p>
  <p class="excerpt">Tradies are some of the busiest small business owners in Australia. AI tools can generate quotes, schedule jobs, and send invoices while you are still on the tools.</p>
</li>
<li>
  <h2><a href="/articles/ai-superannuation-tools-small-business-australia.html">Managing Superannuation with AI: What Australian Small Business Owners Need to Know</a></h2>
  <p class="meta">March 23, 2026 &middot; 7 min read</p>
  <p class="excerpt">Super obligations catch many small business owners off guard. AI-integrated payroll and accounting tools can calculate, track, and lodge super contributions automatically.</p>
</li>
<li>
  <h2><a href="/articles/ai-insurance-comparison-small-business-australia.html">How to Use AI to Compare Business Insurance in Australia</a></h2>
  <p class="meta">March 23, 2026 &middot; 7 min read</p>
  <p class="excerpt">Business insurance in Australia is confusing and expensive if you get it wrong. AI comparison tools and smart brokers are making it easier to find the right cover at the right price.</p>
</li>
```

**Pagination nav** — replace with page 3 nav (no Next arrow):

```html
<nav class="pagination" aria-label="Article pages">
  <a href="/page-2.html" class="pagination-prev">← Prev</a>
  <a href="/">1</a>
  <a href="/page-2.html">2</a>
  <span class="pagination-current" aria-current="page">3</span>
</nav>
```

- [ ] **Step 2: Verify `page-3.html` structure**

Open in browser. Confirm:
- Exactly 5 articles visible (cash flow through insurance)
- Pagination nav shows: `← Prev  1  2  3`
- "3" is bold, others are links
- No Next arrow present
- Clicking "← Prev" goes to `/page-2.html`

- [ ] **Step 3: Commit**

```bash
git add page-3.html
git commit -m "feat: create page-3.html with articles 11-15 and pagination nav"
```

---

## Task 5: Update sitemap.xml

**Files:**
- Modify: `sitemap.xml`

- [ ] **Step 1: Add page-2.html and page-3.html entries to `sitemap.xml`**

Insert after the homepage `<url>` entry (after line 3):

```xml
  <url><loc>https://tools.workswell.com.au/page-2.html</loc><lastmod>2026-03-23</lastmod><priority>0.5</priority></url>
  <url><loc>https://tools.workswell.com.au/page-3.html</loc><lastmod>2026-03-23</lastmod><priority>0.5</priority></url>
```

- [ ] **Step 2: Commit**

```bash
git add sitemap.xml
git commit -m "feat: add page-2 and page-3 to sitemap"
```

---

## Final Verification Checklist

- [ ] `index.html`: 5 articles, nav shows `1 2 3 Next →`, no Prev
- [ ] `page-2.html`: 5 articles, nav shows `← Prev 1 2 3 Next →`
- [ ] `page-3.html`: 5 articles, nav shows `← Prev 1 2 3`, no Next
- [ ] All 15 articles still accessible across the 3 pages (none dropped)
- [ ] Pagination nav current page is bold, others are blue links
- [ ] All cross-page links work correctly
- [ ] `sitemap.xml` has 18 entries (homepage + 2 pagination pages + 15 articles)
