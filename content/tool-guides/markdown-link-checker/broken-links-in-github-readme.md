---
title: Find Broken Links in a GitHub README: Tool and CI Options
h1: How do you find broken links in a GitHub README?
description: Paste the README into a link checker to test external URLs, anchors and reference links, then automate the check with lychee or markdown-link-check.
tool: markdown-link-checker
updated: 2026-11-03
related: /markdown-toc-generator/github-readme-table-of-contents, /github-readme-viewer/readme-images-not-showing, /guides/markdown-link, /markdown-link-generator
---
Paste the README's Markdown into a link checker, which lists every link with its line number, requests each external URL and reports the status, and verifies `#anchor` links against the headings. Relative links to other files in the repository cannot be checked from the text alone; confirm those on GitHub. For ongoing checks, add a link checker to GitHub Actions.

A README collects links faster than anyone maintains them: documentation moves, release pages are renamed, a heading is edited and the table of contents still points at the old slug. This page covers the quick pass before a commit with the [Markdown link checker](/markdown-link-checker), what it can and cannot tell you about a README, and the two command-line checkers most repositories run in CI.

## How do you check a README's links with the online checker?

Open the README on GitHub, switch to the raw view or the editor, copy all of the Markdown and paste it into the checker's text box. It finds the six ways a URL appears in Markdown: inline links `[text](url)`, images `![alt](src)`, reference links `[text][id]` with their `[id]: url` definitions, autolinks in angle brackets, bare URLs that GitHub autolinks, and HTML `<a href>` or `<img src>` tags. Anything inside a fenced code block or inline backticks is ignored, because GitHub does not render it as a link.

Parsing happens in your browser. Click **Check links** and only the list of external `http(s)` URLs is sent to the server, which requests each one and returns the status code; the README text itself is not uploaded. Results come back as a table with the line, the kind of link, its text, the URL and a verdict: green for 2xx, amber for a redirect with the final address shown, red for 4xx and 5xx or a network error. Clicking a problem row selects that line in the editor so you can fix it in place, and the results can be copied as a Markdown table for an issue or pull request.

## Which README links can the checker not verify?

Relative links. A README typically links to `CONTRIBUTING.md`, `docs/setup.md` or `LICENSE`, and the checker only sees the one document you pasted, so it lists those links in grey as "relative, can't check from here" rather than guessing. Verify them where the files live: on GitHub, click each one, or run `git ls-files docs/` locally and compare. The rules GitHub applies are in its [README documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes#relative-links-and-image-paths-in-markdown-files): a relative link is resolved from the current file, a link starting with `/` is relative to the repository root, `./` and `../` work, and the link text must be on a single line. GitHub recommends relative links over absolute ones for files in the same repository because absolute links break in forks and clones.

Anchor links are checked, and strictly. The checker builds the same heading slugs GitHub does (lowercase, spaces to hyphens, punctuation dropped, `-1` and `-2` suffixes on duplicate headings) and flags `#getting-started` when no heading produces that slug. If a table of contents has drifted from the headings, the [README table of contents page](/markdown-toc-generator/github-readme-table-of-contents) explains how to regenerate it. Links to anchors in other files, such as `docs/api.md#auth`, count as relative and are not checked.

## Why does a working link show 403 or an error?

Because some sites refuse requests that do not come from a browser. The checker sends a `HEAD` request first and retries with `GET` when the server answers 403, 405 or 501, a 5xx status or a network error, but a site that blocks automated clients still returns 403 or times out. Cloudflare-protected pages, LinkedIn and some publishers behave this way. Treat a 403 on a page you know is public as "blocked for checkers", not as a dead link; a 404 is a genuinely missing page. Each request has an 8-second timeout, redirects are followed up to five hops, and URLs that point at private or local network addresses are refused before any request is made.

Redirects are not errors. A 301 or 302 is shown in amber with the final URL, because a permanent redirect in a README is worth updating: every hop adds latency, and the old address may stop redirecting one day.

## What are the limits of the online checker?

Up to 100 unique external URLs per run, sent in batches of 25, with 20 runs per 10 minutes from one IP address. Duplicate URLs are checked once and marked as duplicates in the results. That is enough for any README; a documentation folder with hundreds of pages is a job for the command-line tools below, which also handle relative links because they run inside the repository.

## How do you check links automatically with GitHub Actions?

Two open-source checkers are widely used, and both have an official or community GitHub Action.

**lychee** is a command-line checker written in Rust that, according to its [repository](https://github.com/lycheeverse/lychee), finds broken links in Markdown, HTML and other formats and resolves relative links in local files. The [lychee-action](https://github.com/lycheeverse/lychee-action) runs it in a workflow; the README's example runs on a schedule and opens an issue from the report when links fail:

```yaml
name: Links
on:
  schedule:
    - cron: "00 18 * * *"
  workflow_dispatch:
jobs:
  linkChecker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Link Checker
        id: lychee
        uses: lycheeverse/lychee-action@v2
        with:
          fail: false
```

The action accepts an `args` input for lychee's own options (the default checks every `.md`, `.html` and `.rst` file), a `token` input, and `fail: false` to report without failing the job.

**markdown-link-check** is a Node.js tool that, per its [repository](https://github.com/tcort/markdown-link-check), extracts links from Markdown and checks whether each is alive; it installs with `npm install -g markdown-link-check` and also runs from a Docker image. Its JSON config supports `timeout` (default 10 seconds), `ignorePatterns` to skip URLs, `replacementPatterns` to map paths such as `/docs` to your local folder, `retryOn429` with a `retryCount`, and `aliveStatusCodes` to accept codes other than 200. The community [GitHub Action](https://github.com/gaurav-nelson/github-action-markdown-link-check) wraps it with inputs for a config file, a folder path and quiet mode.

Both tools are run from the repository root, so `docs/setup.md` resolves to a real file and relative links are covered, which is the gap the online checker leaves.

## How do rate limits affect link checking?

Two different limits apply. The sites you link to may rate-limit a burst of requests and answer 429, and GitHub itself does this for unauthenticated clients, which matters because READMEs link heavily to GitHub. lychee's README recommends setting a `GITHUB_TOKEN` environment variable or the `--github-token` option "to avoid getting rate-limited while checking GitHub links", and lets you treat 429 as acceptable with an option such as `--accept '200..=204, 429, 500'`. markdown-link-check's `retryOn429` setting waits for the duration in the `Retry-After` header and retries, twice by default. On a schedule, run the check daily rather than on every push so the targets are not hammered.

The second limit is the checker's own. The online tool allows 20 runs per 10 minutes; in CI, lychee and markdown-link-check are limited only by what the target sites tolerate.

## How do you keep README links from breaking in the first place?

Link to files in the repository with relative paths, as GitHub advises, so they survive forks and renames of the default branch. Prefer permanent URLs (a tagged release, a versioned docs page) over "latest" links. Link to headings by the slug GitHub generates rather than a guessed one; the [link syntax guide](/guides/markdown-link) shows the forms, and the [link generator](/markdown-link-generator) writes reference-style links with matching definitions. Keep reference definitions together at the bottom of the file, where a missing `[id]: url` line is easy to spot; the checker reports those as undefined references. Run the quick check before each commit, and let a scheduled Action catch the links that die later. Images have their own failure modes, covered in [why README images are not showing](/github-readme-viewer/readme-images-not-showing).
