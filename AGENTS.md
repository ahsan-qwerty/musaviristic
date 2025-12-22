# AGENTS.md
## Frontend-Only CMS-Ready Publishing Site

This project is a **frontend-only implementation** of a publishing platform
(articles, blogs, serialized novels).

There is **NO CMS in this phase**, but the frontend **must be CMS-ready**.
All architectural decisions must assume that content will later come from a
headless CMS (Directus / Strapi).

---

## NON-NEGOTIABLE RULES

1. ❌ No hardcoded content in components or pages
2. ❌ Pages/components must NOT read from `/content` directly
3. ✅ All content MUST be accessed via `/lib/content/*`
4. ❌ No CMS, admin panel, backend, or database logic
5. ❌ No content logic inside UI components

Breaking any rule is a blocking error.

---

## TECH STACK (FIXED)

- Next.js (App Router)
- TypeScript preferred
- Tailwind CSS
- Next.js Image
- Local structured content (temporary)

---

## REQUIRED STRUCTURE

```

/app
/components
/lib/content
/content
/public/images

````

Pages may only import from `/lib/content`.

---

## CONTENT CONTRACTS (DO NOT CHANGE)

**Author**
```ts
{ id, name, bio, profileImage }
````

**Article**

```ts
{ id, title, slug, content, featuredImage, authorId, publishDate, tags? }
```

**Novel**

```ts
{ id, title, slug, description, coverImage, authorId, status }
```

**Chapter**

```ts
{ id, novelSlug, chapterNumber, title, content, publishDate }
```

---

## REQUIRED FEATURES

* Articles list & detail pages
* Novels with chapter lists
* Chapter reading page with Prev / Next navigation
* Author pages
* Images inside content

Chapter navigation MUST be data-driven (sorted by chapterNumber).

---

## COMPONENT RULES

* Components are presentational only
* No data fetching inside components
* Content rendered via props

---

## OUT OF SCOPE

* CMS integration
* Admin panel
* Auth
* Database
* Comments
* Analytics

---

## MENTAL MODEL

This is **not a static site**.
This is the **frontend of a publishing system**.

Build so the data source can be swapped without refactoring.
