---
title: Markdown Tables in Jupyter Notebooks: Cells and pandas
h1: How do you make a table in a Jupyter notebook Markdown cell?
description: Switch the cell to Markdown (press M), write a GFM pipe table and run it. Alignment, LaTeX in cells, HTML tables, pandas to_markdown(), nbconvert.
tool: markdown-table-generator
updated: 2026-11-03
related: /guides/markdown-table, /csv-to-markdown/markdown-table-to-csv, /markdown-to-pdf/markdown-table-to-pdf, /markdown-viewer
---
Change the cell type to Markdown, type a GitHub Flavored Markdown pipe table (a header row, a row of hyphens, then data rows) and run the cell to render it. Jupyter's Markdown cells support GFM tables, inline LaTeX with `$...$` and raw HTML tables. To build the table from a DataFrame, print `df.to_markdown()` and paste the result.

Jupyter renders Markdown cells with the same table syntax GitHub uses, so anything in the [Markdown table syntax guide](/guides/markdown-table) applies. The notebook-specific questions are how to get into a Markdown cell, what else can go in a cell (maths, HTML, images), how to produce a large table from code instead of typing it, and what happens to the table when the notebook is exported or viewed on GitHub. Build or clean up the table in the [table generator](/markdown-table-generator) if you would rather not count pipes.

## How do you switch a cell to Markdown and render it?

Select the cell and change its type. The [Jupyter Notebook documentation](https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Working%20With%20Markdown%20Cells.html) says you can do that "by using the Cell menu, the toolbar, or the key shortcut m"; the `m` shortcut works in command mode, which the [JupyterLab notebook docs](https://jupyterlab.readthedocs.io/en/stable/user/notebook.html) describe as the mode you enter by pressing Esc, where keyboard shortcuts act on whole cells. Type the table, then run the cell the same way you run a code cell; the Markdown source is replaced by the rendered table. Double-click the rendered cell to edit the source again.

A cell left as a code cell shows the pipes as a syntax error when run, which is the most common reason a table "does not work" in a notebook.

## What table syntax do Jupyter Markdown cells accept?

GFM pipe tables. The Notebook documentation states that the web app "supports Github flavored markdown" and gives a table as one of its examples. The rules are the ones from the [GFM specification](https://github.github.com/gfm/#tables-extension-): a header row, a delimiter row with at least one hyphen per column, optional colons in the delimiter row for alignment, and `\|` for a literal pipe inside a cell.

```markdown
| Model | Accuracy | Notes |
|:------|---------:|:-----:|
| baseline | 0.812 | no tuning |
| tuned | 0.874 | `lr=3e-4` |
```

| Model | Accuracy | Notes |
|:------|---------:|:-----:|
| baseline | 0.812 | no tuning |
| tuned | 0.874 | `lr=3e-4` |

Leave a blank line between the table and any paragraph above it, keep each row on one line, and put inline code or links in cells as you would anywhere else. Block content such as a list or a code fence cannot go inside a cell; the spec is explicit that block-level elements cannot be inserted in a table.

## Can a table cell contain LaTeX?

Yes, inline maths works inside a cell. The Notebook documentation explains that Markdown cells render mathematical expressions through MathJax, with inline expressions written between single dollar signs, such as `$e^{i\pi} + 1 = 0$`. Because a pipe-table cell holds inline content, an inline expression in a cell is handled like one in a paragraph:

```markdown
| Quantity | Formula |
|---|---|
| Energy | $E = mc^2$ |
| Norm | $\lVert x \rVert_2$ |
```

The one trap is the pipe character. The table parser splits rows at `|` before it looks at anything else, so a bare `|x|` inside the maths breaks the row. Use LaTeX commands for the bars instead, such as `\lvert x \rvert`, `\vert` or `\lVert`, which contain no pipe characters. Displayed equations, which the documentation writes with `\begin{equation}` and `\end{equation}`, are block content and belong in their own cell rather than in a table.

## How do you generate a Markdown table from a pandas DataFrame?

Call `to_markdown()` and print the result. The [pandas documentation](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_markdown.html) describes `DataFrame.to_markdown()` as generating "a Markdown table representation of the DataFrame using the tabulate library" and notes that it "requires the tabulate package", so install that first:

```bash
pip install tabulate
```

```python
import pandas as pd

df = pd.DataFrame({"animal_1": ["elk", "pig"], "animal_2": ["dog", "quetzal"]})
print(df.to_markdown())
```

The documented output is a pipe table with a delimiter row that already carries alignment colons (`|---:|:---|`), numbers right-aligned and text left-aligned. Copy the printed text into a Markdown cell and run it, and it renders as a table. Two parameters are worth knowing. `index=False` leaves out the index column, which is usually what you want for a report. Any extra keyword arguments are passed to tabulate; the pandas page shows `tablefmt="grid"`, which produces a grid table drawn with `+` and `=`. Grid tables are not GFM, so a notebook cell shows them as text; keep the default format for anything a Markdown renderer will read.

If the DataFrame is large, remember that a Markdown table is for reading, not for storage. Export the data as CSV and keep a short Markdown table in the notebook for the numbers you want the reader to see. The [Markdown table to CSV page](/csv-to-markdown/markdown-table-to-csv) covers going the other way when a table in a notebook needs to become data again.

## Can you use an HTML table in a Markdown cell?

Yes. The Notebook documentation says that "because Markdown is a superset of HTML you can even add things like HTML tables", and shows one with `<table>`, `<tr>`, `<th>` and `<td>`. An HTML table is the way to get merged cells or lists inside a cell, neither of which a pipe table allows. The limits are the usual ones: JupyterLab's documentation states that Markdown cells are always sanitised, so scripts and styles in the HTML are removed, and the table does not survive export to formats that do not render HTML.

The same documentation page shows that Markdown cells can reference local files, including `<img src="...">` for an image and a `<video controls src="...">` tag for a video, and that since Notebook 5.0 a file can be attached to a Markdown cell, in which case its URL starts with `attachment:`. An image in a table cell therefore works in a notebook, with the caveat that referenced files must exist wherever the notebook is viewed.

## What happens to the table when you export or share the notebook?

It stays a table in every format that supports one. The [nbconvert documentation](https://nbconvert.readthedocs.io/en/latest/usage.html) lists HTML, LaTeX, PDF, WebPDF, Reveal.js slides, Markdown, reStructuredText, executable script and notebook as output formats, run as `jupyter nbconvert --to html notebook.ipynb`. The HTML exporter renders the Markdown cell, table included; `--to pdf` goes through LaTeX, and `--to webpdf` renders the HTML in headless Chromium, which needs the `nbconvert[webpdf]` extra. For `--to markdown`, the page says Markdown cells are "unaffected", so the pipe table is written out as you typed it, which makes that exporter a quick way to pull tables out of a notebook into a README.

On GitHub, `.ipynb` files "render as static HTML files in your repository", according to the [GitHub documentation on non-code files](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files#working-with-jupyter-notebook-files-on-github), so Markdown tables show as tables there too; only interactive output such as JavaScript plots is lost. For a PDF of just the table, [Markdown table to PDF](/markdown-to-pdf/markdown-table-to-pdf) describes the options outside Jupyter.

## Why is my table not rendering in the notebook?

Check these in order. The cell is still a code cell: look at the cell type dropdown in the toolbar. The row of hyphens is missing or has a different number of columns from the header, which makes the parser treat the lines as a paragraph. A row is wrapped onto two lines; every row must be one line. A pipe inside a cell, often in inline code or a regex, is not escaped as `\|`. There is no blank line between the table and the text above it. Paste the cell's source into the [Markdown viewer](/markdown-viewer) to see how a GFM parser reads it, or rebuild it in the table generator, which pads the columns and escapes pipes for you.

## Does JupyterLab render anything else in Markdown cells that GitHub does not?

Mermaid diagrams. The JupyterLab documentation says it "includes built-in support for rendering Mermaid diagrams in Markdown cells" from fenced code blocks with the `mermaid` language identifier, without an extra extension. That is unrelated to tables, but it matters when a notebook is exported: a Mermaid block renders in JupyterLab and on GitHub, which also supports Mermaid, while `--to pdf` through LaTeX does not draw it. Tables have no such problem; they are plain GFM and come through every exporter.
