# Pillgram portfolio

Production-oriented, responsive product-design case study built with Next.js App Router and TypeScript. P1 and P2 render on the server; editable content and assets come from Notion, with a local fallback for development.

## Run locally

```bash
npm install
npm run dev
```

No environment variables are required for local development. Without a complete Notion configuration, `data/pillgram-fallback.ts` is used.

## Notion setup

Create three Notion data sources, share them with an internal integration, copy `.env.example` to `.env.local`, and set:

- `NOTION_TOKEN`: secret integration token (server-only)
- `NOTION_PROJECTS_DATA_SOURCE_ID`: Projects data source ID
- `NOTION_SECTIONS_DATA_SOURCE_ID`: Sections data source ID
- `NOTION_ITEMS_DATA_SOURCE_ID`: Items data source ID
- `NOTION_PROJECT_SLUG`: project slug; defaults to `pillgram`

Never prefix the token or IDs with `NEXT_PUBLIC_`. Requests use Notion API version `2026-03-11` and run only on the server. File URLs are read at request/revalidation time and are never copied into persisted application data.

### Supported properties

Property names are case-sensitive. The adapter accepts the first matching alias below.

| Data source | Fields |
| --- | --- |
| Projects | `Title`/`Name`, `Slug`, `Summary`/`Description` (rich text), `Role`, `Period`/`Year`, `Hero`/`Hero image` (files), `Hero alt`/`Alt text` |
| Sections | `Title`/`Name`, `Project`/`Projects` (relation), `Order` (number), `Eyebrow`/`Kicker`, `Body`/`Description` (rich text), `Quote`, `Image`/`Media` (files), `Alt`/`Alt text` |
| Items | `Label`/`Name`/`Title`, `Section`/`Sections` (relation), `Order` (number), `Value`/`Metric` (number), `Note`/`Description` |

Every image should include meaningful alt text. Ordered items in the second section become the P2 flow and shared-baseline chart. Numeric values are interpreted as percentages from 0–100.

## Validation

```bash
npm run lint
npm run build
```
