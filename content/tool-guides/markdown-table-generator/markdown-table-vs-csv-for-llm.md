---
title: Markdown Table or CSV for an LLM Prompt? How to Choose
h1: Should I give an LLM a Markdown table or CSV?
description: CSV uses fewer tokens; a Markdown table marks every cell boundary and renders in chat. Measured token counts, quoting pitfalls, and when to use neither.
tool: markdown-table-generator
updated: 2026-10-17
related: /csv-to-markdown, /json-to-markdown-table, /guides/markdown-table, /markdown-table-generator/sort-markdown-table
---
For small tables that a person will also read, a Markdown table is a sound default: every cell boundary is marked and the table renders in chat interfaces. For larger data, CSV is more compact and usually the better choice. Either way, test on your own data, because no format is right for every model and task.

Both formats carry the same information: rows, columns and a header. The differences are in how many tokens they cost, how they handle awkward values such as commas and line breaks, and how readable they are to the person checking the prompt and the answer. None of these differences is large for a ten-row table. They start to matter when the table is hundreds of rows long or when the values are messy.

## How many more tokens does a Markdown table use than CSV?

It depends on the data and the tokenizer, but Markdown always adds characters: pipes between and around cells, spaces, and a delimiter row. As one measured example, here is the same seven-row, four-column table in three forms, counted with OpenAI's [tiktoken](https://github.com/openai/tiktoken) library and its `o200k_base` encoding:

| Format | Characters | Tokens (o200k_base) |
|---|---|---|
| CSV | 139 | 61 |
| Markdown table, compact (`\| a \| b \|`) | 235 | 96 |
| Markdown table, padded to align columns | 311 | 120 |

The table was:

```text
Region,Quarter,Revenue,Units
North,Q1,12400,310
North,Q2,13150,322
South,Q1,9800,255
South,Q2,10275,268
West,Q1,15020,401
West,Q2,14790,389
```

Treat the ratio as an illustration, not a constant. Other models use other tokenizers, longer text values dilute the overhead of the pipes, and short numeric values like these show it at its largest. The useful conclusion is narrower: padding spaces cost tokens and add nothing for a model, so if you send Markdown, send it compact. Count with your own provider's tokenizer before you decide on cost grounds.

## When is a Markdown table the better choice?

When the table is small to medium, and a person will read the prompt or the answer. A few reasons:

- **Explicit boundaries.** Every cell is enclosed in pipes, including empty ones, so `| North | | 310 |` shows clearly that the middle value is missing.
- **Rendering.** Chat interfaces that render Markdown show the table as a table, which makes it easy to check that the model saw what you meant to send.
- **Matching output.** If you want a table back, giving one in the same format shows the shape you expect.
- **Mixed documents.** A table inside a Markdown document (a spec, a README, meeting notes) can stay as it is, with headings and prose around it.

The [Markdown table generator](/markdown-table-generator) builds a correctly escaped table in compact or padded form, and the [CSV to Markdown converter](/csv-to-markdown) turns existing CSV into one, with a Pad columns option you can switch off to save tokens.

## When is CSV the better choice?

When the table is large, when cost or context length is the constraint, or when the data already exists as CSV and converting it adds a step where things can go wrong. CSV has a published convention for awkward values: [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) says fields containing commas, double quotes or line breaks are enclosed in double quotes, and a double quote inside such a field is doubled. A cell with a comma or a multi-line address is therefore unambiguous in well-formed CSV.

Markdown tables have no equivalent for line breaks. A cell must stay on one line, so line breaks become `<br>` and every pipe inside a value must be escaped as `\|`. That is fine for a handful of cells and fragile for messy text exports. If your values contain many commas, a tab-separated file avoids most quoting.

## What goes wrong with either format?

The same handful of problems show up in prompts regardless of format:

- **Unlabelled columns.** A header like `q2_adj_v3` means nothing to a model. Rename columns to plain words, and add units: `Revenue (USD)`.
- **Inconsistent values.** Dates in two formats, numbers with and without thousands separators, `N/A` next to empty cells. Clean them before sending; the model will otherwise guess.
- **Broken rows.** An unescaped pipe in Markdown or an unquoted comma in CSV shifts every following value one column to the right. Check the row count and column count after conversion.
- **Too many columns.** Very wide rows make it hard to keep a value attached to its header at the far end of a long row. Drop columns the task does not need.

## When should I use neither?

When the data is large enough that the model does not need to read every row, or when the answer requires exact arithmetic. Pasting thousands of rows into a prompt to ask for a total or an average asks the model to do in its head what a few lines of code do exactly. If your setup offers file upload with code execution or a database tool, give it the file and ask for the computation. Paste a table only when the model needs to read and reason over the rows themselves: compare a few options, spot an outlier, write a summary.

For nested or record-like data, a third shape is often clearer than either: one JSON object per row, or `key: value` lines per record. Each value then carries its own label, at the cost of repeating the keys. The [JSON to Markdown table converter](/json-to-markdown-table) goes the other way when you need a table for a person.

## Does sorting or ordering the rows matter?

It can help. If the question is about the largest values or a date range, sort the rows by that column first so the relevant rows are together, and say in the prompt how the table is ordered. See [how to sort a Markdown table](/markdown-table-generator/sort-markdown-table) for ways to do it without retyping.

## What should the prompt say around the table?

Say what the table is, where it came from, what each row represents, and any column whose meaning is not obvious. Put the instruction before or after the table rather than in the middle, and state the output format you want. Those few sentences usually matter more than the choice between pipes and commas. The [Markdown table guide](/guides/markdown-table) covers the syntax rules if you write the table by hand.
