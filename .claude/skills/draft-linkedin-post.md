---
name: draft-linkedin-post
description: Use when the user runs /draft-linkedin-post — drafts a LinkedIn company page post promoting an article from tools.workswell.com.au (workswell). Optionally accepts an article slug or title as an argument to target a specific article; if none given, picks the best article from the site automatically.
---

# Draft LinkedIn Post

Drafts a LinkedIn company page post promoting an article from workswell (tools.workswell.com.au).

**Working directory:** The `smartbizau-site` git repository.

## Step 1 — Identify the Article

**If an article is specified in the arguments** (e.g. `/draft-linkedin-post ai-grant-writing-tools-australia` or a partial title):
- Match the argument to a file in `articles/*.html`
- Read the article's `<h1>` title and `<meta name="description">` excerpt

**If no article is specified:**
- Scan `articles/*.html` and find the most recently published article (highest `datePublished` in the JSON-LD block)
- Use that article

Extract:
- **Title**: from `<h1>`
- **Slug**: filename without `.html`
- **URL**: `https://tools.workswell.com.au/articles/{SLUG}.html`
- **Excerpt**: from `<meta name="description">`
- **Key points**: skim the `<h2>` subheadings in the article body

## Step 2 — Draft the LinkedIn Post

Write a LinkedIn post in this structure:

**Line 1 — Hook** (1 sentence, no fluff)
A specific, punchy statement about the problem or opportunity the article addresses. Targeted at Australian small business owners. Do NOT start with "Are you..." or "Did you know...".

**Blank line**

**Body** (3–4 bullet points using →)
Each point is a concrete, practical takeaway from the article. Specific over generic. Australian context where relevant (ABN, GST, BAS, ATO, AUD).

**Blank line**

**CTA line**
One sentence pointing to the guide. End with "Link in comments 👇"

**Blank line**

**Hashtags** (4–6 relevant tags)
Always include: #SmallBusiness #Australia
Add 2–4 topic-specific tags based on the article content.

**Post-draft note** (output this after the post, outside the post itself):
> 💡 Paste the article URL as the first comment, not in the post body — LinkedIn deprioritises posts with external links.
> URL: {FULL_ARTICLE_URL}

## Style Rules

- Tone: direct, practical, no hype — matches the site's editorial voice
- No em dashes
- No exclamation marks in the body (one is OK in the hook if genuinely warranted)
- Write for a business owner scrolling on their phone, not a marketer
- Max 1,200 characters for the post body (LinkedIn shows "see more" after ~210 chars — the hook must earn the click)
- No quotes around the post — just output the raw post text ready to copy-paste
