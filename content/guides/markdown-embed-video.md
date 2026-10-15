---
title: Markdown Embed Video — YouTube, GitHub Uploads, Iframes
h1: How to embed a video in markdown
description: Embed a video in markdown: a clickable thumbnail link works everywhere, uploaded MP4/MOV URLs play inline on GitHub, iframes are stripped by GitHub and GitLab, and Obsidian, Notion, Docusaurus and Hugo each have their own YouTube embed.
updated: 2026-10-15
related: markdown-image, markdown-link, markdown-collapsible-section, markdown-anchor-link
---
Markdown has no video syntax. The one pattern that works in every renderer is an image wrapped in a link, so a thumbnail opens the video when clicked:

```markdown
[![Watch the demo](https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)
```

On GitHub you can go one better by uploading the video file itself: the generated URL plays inline. Everywhere else, inline playback depends on whether the renderer keeps `<iframe>` or `<video>` HTML (most strip it) or has its own embed shortcode. This guide covers each case and the exact syntax.

## How do you add a YouTube video to a markdown file?

Use the thumbnail-link pattern. YouTube serves a still for every public video at `https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg` (also `maxresdefault.jpg` for 1280px where available, `0.jpg` for 480px), so the image is reliable and the link opens YouTube:

```markdown
[![Project walkthrough](https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID "Watch on YouTube")
```

This is an [image](/guides/markdown-image) inside a [link](/guides/markdown-link), both standard CommonMark, which is why it renders on GitHub, GitLab, Reddit, in docs generators and in email. The reader sees a frame and a play-shaped expectation; add a caption line such as "▶ Watch the 3-minute demo" under it so the intent is clear in renderers that show images without a pointer cursor. The thumbnail does not play inline anywhere; for that, see the platform sections below.

## How do you embed a video on GitHub?

Upload the file. GitHub's [attaching files docs](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files) list `.mp4`, `.mov` and `.webm` as supported media, with a 10 MB limit on free plans and 100 MB on paid plans, and recommend H.264 for the widest playback. Drag the file into any issue, pull request, discussion or comment box; GitHub uploads it and replaces the text with an asset URL. Paste that URL on its own line in markdown, including in a README, and GitHub renders a video player:

```markdown
Here is the feature in action:

https://github.com/user-attachments/assets/3f1c2d4e-....mp4
```

Two things do not work. Raw `<video>` and `<iframe>` tags are removed by GitHub's HTML sanitiser (`video` and `iframe` are not on the allowlist), so a YouTube embed snippet renders as nothing. And a video file committed into the repository does not play from a `blob` or `raw` URL in the same way; only the uploaded asset URL gets the player. The upload has to happen through a comment or editor box, after which the URL is reusable in any file.

## Can you embed a video on GitLab?

Yes, with image syntax pointing at a video file. GitLab's [markdown docs](https://docs.gitlab.com/ee/user/markdown.html#videos) say an image link to a `.mp4`, `.m4v`, `.mov`, `.webm` or `.ogv` file is rendered as a video player, and that the size can be set with an attribute list:

```markdown
![Sample video](img/demo.mp4){width=75%}
```

Iframes on GitLab are an experiment behind a feature flag (`allow_iframes_in_markdown`, off by default) that an administrator has to enable, with providers such as YouTube on an allowlist and the content loaded in a sandboxed frame. Until that is on for your instance, use the file-upload form above or a thumbnail link for YouTube.

## Where do iframes and HTML video tags render?

Only in tools that render raw HTML without sanitising it. The pattern across platforms:

| Platform | `<iframe>` YouTube embed | `<video src>` tag | Native alternative |
|---|---|---|---|
| GitHub | Stripped | Stripped | Uploaded asset URL on its own line |
| GitLab | Stripped unless admin enables the experimental flag | Stripped | `![](file.mp4)` for uploaded files |
| Obsidian | Rendered | Rendered | `![](https://www.youtube.com/watch?v=ID)` ([Obsidian embeds](https://obsidian.md/help/embed-web-pages)) |
| Notion | Not markdown; use blocks | Not markdown | `/video` block or paste the YouTube URL and choose Embed ([Notion basics](https://www.notion.com/help/writing-and-editing-basics)) |
| Typora | Rendered | Rendered ([Typora reference](https://support.typora.io/Markdown-Reference/)) | Paste the embed code |
| Docusaurus (MDX) | Rendered as JSX `<iframe>` | Rendered as JSX | Any React player component ([MDX and React](https://docusaurus.io/docs/markdown-features/react)) |
| Hugo | Rendered if `unsafe` HTML is enabled; otherwise removed | Same | `{{< youtube ID >}}` shortcode ([Hugo docs](https://gohugo.io/shortcodes/youtube/)) |
| Jekyll, MkDocs | Rendered | Rendered | Theme plugins |
| Reddit, Slack, Discord | Stripped or literal | Stripped or literal | Paste the URL; the app unfurls a preview |

In the chat apps and on Reddit the right move is to paste the YouTube or video URL as plain text. Slack and Discord unfurl a playable card, and new Reddit shows a link preview. A markdown thumbnail link is pointless there because none of them render markdown images.

## How do you embed YouTube in Obsidian, Docusaurus and Hugo?

Each has a one-line native form that is cleaner than an iframe:

```markdown
Obsidian:   ![](https://www.youtube.com/watch?v=VIDEO_ID)
Hugo:       {{< youtube VIDEO_ID >}}
Docusaurus: <iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video" allowFullScreen></iframe>
```

Obsidian's embed docs document the image syntax with a YouTube watch URL (and the same for tweets), plus a plain `<iframe src="...">` for any page that allows embedding. Hugo's shortcode takes the video id and optional `start`, `end`, `autoplay`, `loop`, `mute`, `loading=lazy` and `title` parameters, and it emits a responsive iframe for you. In Docusaurus every file is MDX, so the YouTube embed code works as-is, with attributes in JSX case (`allowFullScreen`, `frameBorder`); the only trap is that MDX does not accept raw HTML that is not valid JSX, such as an unclosed tag. None of the three forms render on GitHub: Obsidian's shows a broken image, the Hugo shortcode prints literally and the iframe is removed. Keep the thumbnail link as the version in a README.

## Why is my video not showing in markdown?

Work through the usual causes:

1. **You used an iframe on GitHub or GitLab.** It is sanitised away. Upload the file (GitHub) or use image syntax with a video file (GitLab).
2. **The file is committed, not uploaded.** On GitHub only the asset URL from a drag-and-drop upload gets a player.
3. **The file is over the limit.** 10 MB on free GitHub plans; compress or trim it, or host it on YouTube and link a thumbnail.
4. **The thumbnail URL is wrong.** `img.youtube.com/vi/ID/hqdefault.jpg` needs the 11-character video id, not the full watch URL.
5. **Unsupported codec.** GitHub notes that codec support is browser specific and recommends H.264 MP4.
6. **The renderer shows images but not links around them.** Rare, but some chat previews drop the link; add the URL as plain text under the image too.

The [markdown viewer](/markdown-viewer) renders the thumbnail-link pattern exactly as GitHub does, so you can check the image and link before committing. For a video that should not dominate the page, wrap it in a [collapsible section](/guides/markdown-collapsible-section) so readers opt in.

## What is the best practice for video in a README?

Host the video somewhere that will outlive the repository (YouTube, or a GitHub upload for short clips), put a thumbnail link in the README so it works on every mirror and package registry that renders the file (npm, PyPI and crates.io strip HTML and iframes too), keep clips under a minute, and write one sentence that says what the viewer will see so people on slow connections can skip it. An animated GIF is still the most portable "video" for a ten-second UI demo, since it is an ordinary image, at the cost of file size and no sound. For the rest of the syntax see the [markdown cheat sheet](/markdown-cheat-sheet).
