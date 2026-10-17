---
title: How to Make a Table of Contents in Obsidian
h1: How do I make a table of contents in Obsidian?
description: Use the Outline core plugin for navigation, write a list of [[#Heading]] links for a TOC inside the note, or add a plugin that keeps one updated.
tool: markdown-toc-generator
updated: 2026-10-17
related: /guides/markdown-headings, /guides/markdown-anchor-link, /guides/markdown-nested-list, /markdown-toc-generator/github-readme-table-of-contents
---
Obsidian has no built-in command that writes a table of contents into a note. For navigation, use the Outline core plugin, which lists the note's headings in a side panel. For a TOC inside the note, write a list of heading links in the form `[[#Heading name]]`, or install a community plugin that generates and updates one for you.

Which one you want depends on who the TOC is for. If it is only for you while you work in the note, the Outline panel is enough and needs no upkeep. If the note will be read by others, exported, or published somewhere else, a list written into the note travels with the file. The sections below cover each route and the formats that keep working outside Obsidian.

## How do I use the Outline panel as a table of contents?

Outline is a core plugin that "lists the headings in the active note" ([Obsidian Help, Outline](https://obsidian.md/help/plugins/outline)). Click a heading in the panel to jump to that section. You can also drag a heading within the outline to move the whole section, which makes it a quick way to reorder a long note. If you do not see the Outline panel, open **Settings → Core plugins** and make sure Outline is turned on; Obsidian's help notes that some core plugins are disabled by default.

The outline updates as you type, and it reflects heading levels as nesting, so a clean heading hierarchy (H2 sections, H3 subsections, no skipped levels) gives you a clean outline. The [headings guide](/guides/markdown-headings) explains the levels and the syntax. The limit is that Outline is part of the app's interface, not of the note. It does not appear in the note's text, in an export, or on another device that opens the file in a different editor.

## How do I write a table of contents inside a note?

Write a bulleted list of internal links to the note's own headings. In Obsidian, a link to a heading in the same note is `[[#` followed by the heading text ([Obsidian Help, Internal links](https://obsidian.md/help/links#Link%20to%20a%20heading%20in%20a%20note)):

```markdown
## Contents

- [[#Goals]]
- [[#Plan]]
  - [[#Plan#Timeline|Timeline]]
  - [[#Plan#Budget|Budget]]
- [[#Open questions]]
```

You do not need to type the heading names exactly. Type `[[#` and Obsidian shows a list of the headings in the current note; pick one and it completes the link. The help page also documents linking to a subheading by chaining hashes, as in `[[#Plan#Timeline]]`, and changing the visible text with a vertical bar, as in `[[#Plan#Timeline|Timeline]]`, which keeps the list readable. Indent child items under their parent with a tab or spaces, as you would for any [nested list](/guides/markdown-nested-list).

Unlike GitHub, Obsidian does not turn headings into slugs. A link to a heading uses the heading's own text. If you rename a heading, Obsidian can update links to it automatically; that behavior is controlled by **Settings → Files and links → Automatically update internal links**, according to the same help page.

## Can I get a table of contents that updates itself in Obsidian?

Yes, with a community plugin. Several are listed in Obsidian's community plugin directory; one of them, Automatic Table Of Contents, renders a TOC from a code block and refreshes it when the note changes ([plugin README](https://github.com/johansatge/obsidian-automatic-table-of-contents)):

````markdown
```table-of-contents
title: **Contents**
minLevel: 2
maxLevel: 3
```
````

Options include `style` (`nestedList`, `nestedOrderedList` or `inlineFirstLevel`), `minLevel` and `maxLevel` for heading depth, and `include` and `exclude` patterns. To install any community plugin, open **Settings → Community plugins**, turn off Restricted mode, then browse, install and enable the plugin ([Obsidian Help, Community plugins](https://obsidian.md/help/community-plugins)).

Be clear about the trade-off. The plugin's README says the TOC "doesn't generate real Markdown in the document", so it "won't be visible when exporting, or on Obsidian Publish", and links might not work in PDFs. Outside Obsidian the code block is shown as a plain code block. Community plugins are also third-party code, which is why Obsidian keeps them off until you turn off Restricted mode.

## How do I make an Obsidian TOC that also works on GitHub?

Use standard markdown links with GitHub-style anchors instead of wikilinks. GitHub does not understand `[[#Heading]]` and will show it as plain text, so a note that will also live in a repository needs links like `[Open questions](#open-questions)`. You can generate that list by pasting the note into the [markdown TOC generator](/markdown-toc-generator), which builds anchors with GitHub's rules.

Check the result inside Obsidian as well. Obsidian's documented markdown form for heading links uses the heading text, for example `[Section name](Example.md#Details)`, with spaces written as `%20`, while GitHub uses lower-case slugs with hyphens. A TOC built for one may not navigate in the other, so test the links in both places before relying on them. The [anchor link guide](/guides/markdown-anchor-link) compares how GitHub, Obsidian and other platforms form heading anchors, and the [GitHub README TOC guide](/markdown-toc-generator/github-readme-table-of-contents) covers placement on GitHub.

## Should I switch Obsidian to markdown links instead of wikilinks?

Only if the notes need to be read outside Obsidian. Obsidian's help explains that it creates wikilinks by default because they are more compact, and that you can switch by turning off **Use [[Wikilinks]]** under **Settings → Files and links**. After that, typing `[[` still opens the suggestion list, but Obsidian inserts a markdown link instead. That makes new links more portable, but it does not convert links you already wrote, and wikilinks remain easier to type and read. The [Obsidian markdown reference](/obsidian-markdown) lists the other syntax that only Obsidian understands.

## Why is my Obsidian table of contents link not working?

The heading text in the link no longer matches the note. Common reasons are a heading that was edited by hand while automatic link updates were off, a typo or different spacing in the link, or a heading that contains characters Obsidian warns against in links, such as `#`, `|`, `^`, `:` or `[[ ]]`. Retyping the link with `[[#` and choosing the heading from the suggestion list is the quickest fix. For TOCs built with GitHub-style slugs, the cause is usually the anchor format, as described above.

## Is a written table of contents worth it for short notes?

Usually not. A note with three or four sections is faster to scroll than to navigate, and the Outline panel already covers it with no upkeep. A written list earns its place in long reference notes, notes that other people read, and notes you export or publish, where the Outline panel is not available.
