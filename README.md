# montclairhoa.org

Website for the Montclair Association, Inc. in Augusta, Georgia. It is plain HTML with one stylesheet and no build step. To preview it, open `index.html` in a browser.

## Layout

- Each page is an HTML file named after the page.
- Child pages live in a folder named after their parent page. For example, `pool.html` is the parent of `pool/pool-payment-portals.html`, whose own child pages are in `pool/pool-payment-portals/`.
- `assets/` holds the stylesheet, the font for the Montclair wordmark, the favicon (the wordmark's "M"), and the images.
- `documents/` holds the PDFs and Word files the pages link to.

## Common updates

- **Board minutes:** add the file to `documents/board-minutes/` with a name like `board-minutes-2026-09-september.pdf`, then add a line for it to that year's page in `archives/`.
- **Newsletters:** add the file to `documents/newsletters/` with a name like `newsletter-2026-05-may.pdf`, then add a line to that year's page in `archives/`.
- **New year:** copy last year's page in `archives/` and rename it. Then add it to `archives.html`, and point the Board Minutes and Newsletters links on `index.html` at the new pages.
- **Header, menu, or footer:** these are repeated in every page, so change them with a project-wide find and replace.
- **Payment buttons:** each Converge button sits in its own `<p>` with its `<script>` right after it. The script enables the first button in its parent, so keep each pair together in its own `<p>`.
