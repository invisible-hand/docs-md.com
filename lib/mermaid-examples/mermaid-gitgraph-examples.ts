import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-gitgraph-examples',
  title: 'Mermaid Git Graph Examples — Syntax and Copyable Code',
  description:
    'Mermaid gitGraph syntax with copyable examples rendered live: commit, branch, checkout, merge, cherry-pick, tags, commit types, orientation and colours.',
  h1: 'Mermaid git graph examples',
  label: 'Git graph',
  updated: '2026-11-03',
  answer:
    'A Mermaid git graph starts with the `gitGraph` keyword, then lists Git operations in the order they happen: `commit`, `branch`, `checkout`, `merge` and `cherry-pick`. Every graph begins on a `main` branch, and `branch` creates a new branch and switches to it. Every example below is rendered live from its code.',
  examples: [
    {
      id: 'basic',
      title: 'Basic git graph',
      intro:
        '`commit` adds a commit to the current branch, `branch` creates a branch and switches to it, `checkout` switches back, and `merge` joins another branch into the current one with a merge commit. Without an `id`, each commit gets a random label.',
      code: `gitGraph
    commit
    commit
    branch feature
    commit
    commit
    checkout main
    commit
    merge feature
    commit`,
    },
    {
      id: 'ids-types-tags',
      title: 'Commit IDs, types and tags',
      intro:
        '`id` replaces the random label with your own, `type` changes the marker (`NORMAL`, `REVERSE` for a crossed circle, `HIGHLIGHT` for a filled rectangle), and `tag` adds a release label. Attributes can be combined on one line.',
      code: `gitGraph
    commit id: "init"
    commit id: "add login"
    commit id: "revert login" type: REVERSE
    commit id: "login v2" type: HIGHLIGHT
    commit id: "release" tag: "v1.0.0"`,
    },
    {
      id: 'git-flow',
      title: 'Git flow with feature and release branches',
      intro:
        'A classic branching model: features branch off `develop`, a release branch is cut from `develop`, merged into `main` with a tag, and merged back. Branch names can contain slashes and dots, and `merge` accepts the same `id`, `tag` and `type` attributes as `commit`.',
      code: `gitGraph
    commit id: "init"
    branch develop
    commit id: "dev setup"
    branch feature/search
    commit id: "search UI"
    commit id: "search API"
    checkout develop
    merge feature/search
    branch release/1.0
    commit id: "bump version"
    checkout main
    merge release/1.0 tag: "v1.0"
    checkout develop
    merge release/1.0`,
    },
    {
      id: 'cherry-pick',
      title: 'Cherry-pick a fix onto a release branch',
      intro:
        'Give the commit an `id`, switch to the branch that needs it and write `cherry-pick id:` with that ID. Mermaid draws a new commit on the current branch, marked with a cherry and a tag naming the commit it was copied from.',
      code: `gitGraph
    commit id: "A"
    branch release
    commit id: "B"
    checkout main
    commit id: "C"
    commit id: "fix crash"
    commit id: "D"
    checkout release
    cherry-pick id: "fix crash"
    commit id: "E"`,
    },
    {
      id: 'top-to-bottom',
      title: 'Top-to-bottom orientation',
      intro:
        'Add `TB:` after `gitGraph` to run commits from top to bottom with branches side by side; it needs Mermaid 10.3.0 or later. `LR:` (left to right) is the default, and `BT:` runs bottom to top from Mermaid 11.0.0.',
      code: `gitGraph TB:
    commit id: "1"
    commit id: "2"
    branch develop
    commit id: "3"
    commit id: "4"
    checkout main
    commit id: "5"
    merge develop
    commit id: "6"`,
    },
    {
      id: 'trunk-and-order',
      title: 'Rename the main branch and order branches',
      intro:
        '`mainBranchName` in a `config` block renames `main`, and `rotateCommitLabel: false` prints commit labels flat instead of at an angle. `order:` after a branch name sets its position among the branch lines; the main branch is 0 by default.',
      code: `---
config:
  gitGraph:
    mainBranchName: trunk
    rotateCommitLabel: false
---
gitGraph
    commit id: "a1"
    branch hotfix order: 2
    commit id: "h1"
    checkout trunk
    branch feature order: 1
    commit id: "f1"
    checkout trunk
    merge hotfix
    merge feature`,
    },
    {
      id: 'colours',
      title: 'Branch and label colours',
      intro:
        'Theme variables `git0` to `git7` colour the first eight branches in order, and `gitBranchLabel0` to `gitBranchLabel7` colour their name labels. Use the `base` theme so your colours are not overridden.',
      code: `---
config:
  theme: base
  themeVariables:
    git0: "#4f46e5"
    git1: "#10b981"
    git2: "#f59e0b"
    gitBranchLabel0: "#ffffff"
    gitBranchLabel1: "#ffffff"
    gitBranchLabel2: "#111827"
---
gitGraph
    commit
    branch develop
    commit
    branch feature
    commit
    checkout develop
    merge feature
    checkout main
    merge develop tag: "v2.0"`,
    },
  ],
  sections: [
    {
      h2: 'Which Git commands can a Mermaid git graph draw?',
      paragraphs: [
        'Mermaid reads the commands from top to bottom and draws each commit in the order it appears, so the code reads like a replay of the history. The current branch starts as `main` and changes with `branch` and `checkout`.',
      ],
      table: {
        head: ['Command', 'What it does', 'Attributes'],
        rows: [
          ['`commit`', 'Adds a commit to the current branch', '`id`, `type`, `tag`'],
          ['`branch name`', 'Creates a branch from the current commit and switches to it', '`order`'],
          ['`checkout name` or `switch name`', 'Switches to an existing branch', 'none'],
          ['`merge name`', 'Merges the named branch into the current branch with a merge commit', '`id`, `type`, `tag`'],
          ['`cherry-pick id: "x"`', 'Copies commit `x` from another branch onto the current branch', '`parent` (required for a merge commit)'],
        ],
      },
    },
    {
      h2: 'Which gitGraph settings can you change?',
      paragraphs: [
        'These options go in a `config` block at the top of the diagram, under `gitGraph`, as in the trunk example. Orientation is not a setting but a suffix on the first line: `gitGraph TB:`.',
      ],
      table: {
        head: ['Setting', 'What it does', 'Default'],
        rows: [
          ['`showBranches`', 'Shows the branch names and lines', '`true`'],
          ['`showCommitLabel`', 'Shows the commit labels', '`true`'],
          ['`rotateCommitLabel`', 'Rotates commit labels 45 degrees; `false` prints them horizontally', '`true`'],
          ['`mainBranchName`', 'The name of the first branch', '`main`'],
          ['`mainBranchOrder`', 'Position of the main branch among the branch lines', '`0`'],
          ['`parallelCommits`', 'Draws commits the same distance from their parent at the same level (Mermaid 10.8.0+)', '`false`'],
          ['`LR:`, `TB:`, `BT:`', 'Direction after the keyword (10.3.0+; `BT:` 11.0.0+)', '`LR:`'],
        ],
      },
    },
    {
      h2: 'Why is my Mermaid git graph not rendering?',
      paragraphs: [
        'Most failures are about branches. `checkout` and `merge` need a branch that already exists, so a typo stops the diagram with an error. A branch cannot be merged into itself. A branch name that could be confused with a keyword has to be quoted: `branch "cherry-pick"` works, a bare `branch cherry-pick` is a parse error. If you renamed the main branch with `mainBranchName`, check out the new name, not `main`.',
        'Cherry-pick has its own rules. The commit must have an `id`, it must be on a different branch from the current one, and the current branch needs at least one commit before the cherry-pick. Picking a merge commit also needs `parent:` naming one of its immediate parents. Give every commit a unique `id`: duplicate IDs can draw the graph wrongly, and since Mermaid 11.8.0 they log a warning. Finally, `BT:` needs Mermaid 11.0.0 and `parallelCommits` 10.8.0, so an older renderer will reject or ignore them.',
      ],
    },
    {
      h2: 'How do you change git graph colours?',
      paragraphs: [
        'Colours come from theme variables. `git0` to `git7` set the branch colours and `gitBranchLabel0` to `gitBranchLabel7` the colours of the branch names; after eight branches the colours repeat from the first. For commits, `commitLabelColor`, `commitLabelBackground` and `commitLabelFontSize` style the commit labels, and `tagLabelColor`, `tagLabelBackground`, `tagLabelBorder` and `tagLabelFontSize` style the tags.',
        'Mermaid also has ready-made themes for the whole diagram: `default`, `base`, `forest`, `dark` and `neutral`. Set `theme` in the same `config` block. To set your own colours, start from `base`, which Mermaid’s theming documentation calls the only theme meant to be modified, as the colours example does.',
      ],
    },
  ],
  faq: [
    {
      q: 'How do you tag a release in a Mermaid git graph?',
      a: 'Add `tag: "v1.0"` to the commit or to the merge that represents the release, as in `merge release/1.0 tag: "v1.0"`. Mermaid draws the tag as a label next to the commit. The same line can also carry an `id` and a `type`, so `commit id: "release" type: HIGHLIGHT tag: "v1.0.0"` gives the commit a name, a highlighted marker and a tag at once.',
    },
    {
      q: 'Can a Mermaid git graph show a rebase?',
      a: 'Not as a command. Mermaid’s documented operations are `commit`, `branch`, `checkout` (or `switch`), `merge` and `cherry-pick`, and there is no `rebase`. To show the result of a rebase, draw the history as it looks afterwards: the rebased commits as new commits on top of the target branch. A `cherry-pick` for each moved commit is a close visual match, since it labels where each commit came from.',
    },
    {
      q: 'How do you rename the main branch in a Mermaid git graph?',
      a: 'Set `mainBranchName` in a `config` block at the top of the diagram, under `gitGraph`, for example `mainBranchName: trunk` or `mainBranchName: master`. After that, refer to the branch by its new name: `checkout trunk`, `merge trunk`. Writing `checkout main` would then fail, because no branch called `main` exists. `mainBranchOrder` moves that branch away from the first position.',
    },
    {
      q: 'Does GitHub render Mermaid git graphs?',
      a: 'Yes. GitHub renders fenced `mermaid` blocks in Markdown files, issues, pull requests, discussions and wikis using the Mermaid library, so the `gitGraph` syntax on this page works there. GitHub chooses the Mermaid version, so check newer options such as `BT:` before relying on them; GitHub’s documentation suggests a one-word `info` diagram to show the version in use. See [Mermaid in Markdown](/mermaid-in-markdown).',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: GitGraph diagrams', url: 'https://mermaid.js.org/syntax/gitgraph.html' },
    { label: 'Mermaid documentation: Theme configuration', url: 'https://mermaid.js.org/config/theming.html' },
    { label: 'Mermaid changelog', url: 'https://github.com/mermaid-js/mermaid/blob/develop/packages/mermaid/CHANGELOG.md' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
  ],
  related: ['/mermaid-in-markdown', '/github-flavored-markdown', '/markdown-viewer', '/share-architecture-diagram'],
};
