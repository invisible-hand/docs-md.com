---
title: How to Embed a Video in a GitHub README (What Works)
h1: How do you embed a video in a GitHub README?
description: Upload the .mp4, .mov or .webm in GitHub's editor and keep the generated URL on its own line. Iframes are filtered, so link a thumbnail for YouTube.
tool: github-readme-viewer
updated: 2026-11-03
related: /guides/markdown-embed-video, /guides/markdown-image, /github-readme-viewer/readme-images-not-showing, /github-readme-viewer/preview-readme-before-push
---
Upload the video file through GitHub's web editor: open the README for editing, drag the .mp4, .mov or .webm file into the editor, and GitHub inserts an asset URL. Leave that URL on a line of its own and GitHub renders a video player when the README is viewed. YouTube iframes do not work; link a thumbnail image instead.

Markdown has no video syntax, so everything on this page is GitHub behaviour rather than Markdown. GitHub supports two things: video files uploaded through its own editor, which it plays inline, and ordinary links and images, which is how YouTube and other hosts are handled. The general pattern for every platform is in the [embed video guide](/guides/markdown-embed-video); this page is only about a README on GitHub, with each claim checked against GitHub's documentation or a rendered repository page on 2026-11-03.

## Which video files does GitHub accept, and how big can they be?

The [attaching files documentation](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files) lists `.mp4`, `.mov` and `.webm` as the supported video types. The size limit is 10 MB for a video uploaded to a repository owned by a user or organisation on a free plan, and 100 MB on a paid plan, with a note that uploading more than 10 MB to a paid organisation's repository requires you to be an organisation member or outside collaborator, or on a paid plan yourself. Images and GIFs are limited to 10 MB. GitHub also warns that "video codec compatibility is browser specific" and recommends H.264 for the widest playback, so export an MP4 with H.264 rather than a newer codec.

Uploaded files in a public repository can be accessed without authentication; in a private or internal repository, only people with access to the repository can view them.

## How do you upload the video into the README?

Edit the file on GitHub and drop the video in. GitHub's [basic writing documentation](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#uploading-assets) says you can upload assets "by dragging and dropping, selecting from a file browser, or pasting" to issues, pull requests, comments "and .md files in your repository". The attaching-files page adds that the file is uploaded immediately and "the text field is updated to show the anonymized URL for the file". For a video that is a bare URL of the form `https://github.com/user-attachments/assets/<id>`.

Keep that URL on a line by itself, with a blank line above and below:

```markdown
## Demo

https://github.com/user-attachments/assets/3f1c2d4e-0000-0000-0000-000000000000
```

We checked a public README that does exactly this. On the rendered repository page the bare URL had become a `<video controls muted>` element whose source pointed at a signed `private-user-images.githubusercontent.com` address, which is how GitHub serves the file. The same README also had an asset URL inside a blockquote, and that one rendered as a plain link, so the URL has to be its own paragraph, not part of a quote or a sentence. The upload can also happen in an issue or pull request comment; the URL that appears there works in the README as well, which is handy when you want to test the file before touching the repository.

## Does the HTML video tag work in a README?

Yes, for a GitHub-hosted asset. The same rendered README used `<video src="https://github.com/user-attachments/assets/<id>" controls>` and GitHub rendered it as a player. In our own check through GitHub's Markdown API, a `<video>` tag came back intact with its `src` and `controls` attributes, so the tag survives GitHub's HTML sanitiser. A `width` attribute written in the README did not appear in the rendered output; GitHub applied its own sizing.

What the tag can play is a separate question, decided by the page's Content Security Policy. On 2026-11-03 the `media-src` directive on github.com allowed `github.com`, `user-images.githubusercontent.com`, `secured-user-images.githubusercontent.com`, `private-user-images.githubusercontent.com`, a `github-production-user-asset` S3 bucket, `gist.github.com` and `github.githubassets.com`. A `<video src>` pointing at your own domain, a CDN or a video host is therefore blocked by the browser, even though the tag itself is rendered. Use the tag only with an uploaded asset URL, and put a plain link inside it as a fallback for viewers that do not get the player:

```html
<video src="https://github.com/user-attachments/assets/<id>" controls>
  <a href="https://github.com/user-attachments/assets/<id>">Watch the demo</a>
</video>
```

## Why does a YouTube iframe not show in a README?

Because GitHub Flavored Markdown filters it. The [GFM specification's disallowed raw HTML extension](https://github.github.com/gfm/#disallowed-raw-html-extension-) lists the tags whose leading `<` is replaced with `&lt;` when rendering: `<title>`, `<textarea>`, `<style>`, `<xmp>`, `<iframe>`, `<noembed>`, `<noframes>`, `<script>` and `<plaintext>`. In our API check the YouTube embed snippet came back as escaped text, which is why an iframe shows up on GitHub as literal angle-bracket code or as nothing.

The portable alternative is an image wrapped in a link, so a thumbnail opens the video:

```markdown
[![Watch the demo](https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)
```

YouTube serves a still for every public video at that `img.youtube.com` address; the `hqdefault.jpg` URL returned a JPEG in our check. This is an [image](/guides/markdown-image) inside a link, both standard Markdown, so it also renders on npm, PyPI and every other site that shows your README. Readers get a frame and a click-through rather than inline playback, which is the honest best for anything not hosted on GitHub.

## Can you commit the video to the repository instead of uploading it?

Not for inline playback. GitHub documents the player only for files uploaded through its editor, and the asset URL is the trigger. A committed file referenced with image syntax, `![demo](docs/demo.mp4)`, is rendered as an `<img>` tag pointing at a video, which browsers show as a broken image; that is what GitHub's Markdown API returned in our check. A normal link, `[demo](docs/demo.mp4)`, gives readers a link to the file's page on GitHub, where they can download it. Committing videos also bloats the repository forever, since every version stays in the history. Upload the file to GitHub as an asset, or host it elsewhere and link a thumbnail.

## What is the best fallback when the video cannot be uploaded?

Pick by what the viewer needs. A short animated GIF under 10 MB is an ordinary image, so it plays wherever the README is shown, including package registries; it has no sound and large files are slow. A thumbnail link to YouTube or Vimeo carries long videos with sound at the cost of a click. A linked `<video>` tag with a plain link inside, as shown above, gives GitHub readers a player and everyone else a link. Many READMEs combine two: a GIF or thumbnail at the top for the five-second impression, and a link to the full video underneath.

## How do you check the README before pushing?

The asset URL only exists once GitHub has stored the file, so the upload has to happen on GitHub: in the file editor, or in an issue or pull request comment whose URL you then paste into the README. After that, the [GitHub README viewer](/github-readme-viewer) renders the README from the repository so you can confirm the rest of the page reads well around the video, and [previewing a README before pushing](/github-readme-viewer/preview-readme-before-push) covers local previews, which cannot show GitHub's player because it is added by GitHub's own renderer. Also check the surrounding images; [README images not showing](/github-readme-viewer/readme-images-not-showing) lists the usual causes.

## Where is the uploaded video stored, and who can see it?

GitHub stores it as an anonymized attachment, and serves it from its own hosts rather than from your repository; the file is not in your Git history and does not count toward the repository's size. According to the attaching-files documentation, attachments in a public repository are accessible without authentication, and attachments in a private or internal repository are visible only to people with access to that repository; the signed URL we saw on a rendered page is how that access check is enforced. Deleting an uploaded asset is not covered by the documentation we read, so treat an upload as permanent and avoid uploading anything you may need to retract.
