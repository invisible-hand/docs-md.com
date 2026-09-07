# Share Markdown with Docs MD — GitHub Action

Publish a markdown file from a workflow as a rendered link on [docs-md.com](https://docs-md.com) — a test report, a bundle-size table, release notes, a bug report — and get the URL back as a step output. No account, no token.

```yaml
- name: Publish report
  id: report
  uses: invisible-hand/docs-md.com/action@v1
  with:
    file: bundle-report.md
    expiry: 7d            # 1d | 7d | 30d | never

- run: echo "Readable report: ${{ steps.report.outputs.url }}" >> "$GITHUB_STEP_SUMMARY"
```

## Inputs

| Input | Required | Default | Notes |
|---|---|---|---|
| `file` | yes | — | Markdown file to publish (≤ 120,000 characters) |
| `expiry` | no | `7d` | `1d`, `7d`, `30d`, `never` |
| `filename` | no | basename of `file` | Shown on the page, used for downloads |
| `share-id` | no | — | Update this existing share in place (same URL) |
| `edit-token` | no | — | Required with `share-id`; pass from a secret |
| `api-url` | no | `https://docs-md.com` | Self-hosted instance |

## Outputs

| Output | Meaning |
|---|---|
| `url` | Rendered page for people |
| `raw-url` | `text/markdown` for scripts and AI assistants |
| `id` | Share id |
| `edit-token` | Masked in logs. Store it as a secret if you want to update or delete the share later |
| `expires-at` | Unix epoch in milliseconds, empty for `never` |

## Update the same link on every run

```yaml
- uses: invisible-hand/docs-md.com/action@v1
  with:
    file: STATUS.md
    share-id: ${{ secrets.STATUS_SHARE_ID }}
    edit-token: ${{ secrets.STATUS_EDIT_TOKEN }}
```

Create the share once (by hand or with a first run), then save the id and edit token as repository secrets.

## Notes

- Shares are public to anyone with the link. Keep secrets and private hostnames out of the file.
- Expiry deletes the page; it does not recall copies already fetched.
- Rate limit: 20 shares per minute per IP.
- Runs on `ubuntu-latest` and any runner with `bash`, `curl` and `jq`.
- Full API: https://docs-md.com/api-docs · Walkthrough: https://docs-md.com/github-action
