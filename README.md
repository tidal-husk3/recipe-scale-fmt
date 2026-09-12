# recipe-scale-fmt

Every recipe I paste in from a blog, a PDF, or someone's handwritten notes
looks slightly different: extra whitespace, "1 1/2" vs "1.5" vs "1½", "tbsp"
vs "tablespoon" vs "Tablespoon". This is a command-line formatter that reads
an ingredient list and normalizes each line into a consistent
`quantity unit name` shape, optionally scaling every quantity by a factor at
the same time (doubling a recipe, halving it, converting 4 servings to 6).

It reads from a file or from stdin, so it fits into a pipeline instead of
requiring you to save recipes into some particular directory first.

## Usage

From a file:

```
$ recipe-scale-fmt ingredients.txt
2 cup flour
1 tsp salt
0.5 lb butter
```

From stdin, with scaling:

```
$ cat ingredients.txt | recipe-scale-fmt --scale 1.5
3 cup flour
1.5 tsp salt
0.75 lb butter
```

Input is one ingredient per line. Messy spacing is collapsed, and quantities
can be written as plain integers, decimals, simple fractions (`1/2`), or
mixed numbers (`1 1/2`):

```
$ printf '  2   cups   flour\n1/2 tsp salt\n1 1/2 lb  butter\n' | recipe-scale-fmt
2 cup flour
0.5 tsp salt
1.5 lb butter
```

Lines that don't start with a recognized quantity are passed through as-is
(section headers like "For the crust:" won't be mangled).

### Flags

- `--scale N` / `-s N` — multiply every quantity by `N` (default `1`)

## Building

```
npm run build
node dist/cli.js ingredients.txt
```

No third-party dependencies; the compiler is the only thing you need beyond
Node itself.

## How it works

`src/parse.ts` turns a raw line into `{ quantity, unit, name }`, recognizing
a fixed set of unit spellings and folding them down to a canonical
abbreviation (`tablespoon`, `tablespoons`, `tbsp` all become `tbsp`).
`src/format.ts` applies the scale factor and renders the result back out.
`src/cli.ts` is just argument parsing and I/O glue.
