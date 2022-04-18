## This is fork of: https://github.com/daniel-sc/xliff-simple-merge 
Added:
- option **--no-remove-unused** to keep unused trans-unit id of destination file during merge.
- option **--new-target-blank** to make new translation target blank.

You can use this tool to merge 2 translated files, for example, to merge "new_messages.vi.xlf" into "messages.vi.xlf" and keep missing translations of messages.vi.xlf compared to new_messages.vi.xlf you can use the following command:
```
npx @bugatino\xliff-simple-merge -i new_messages.vi.xlf -d messages.vi.xlf --no-remove-unused
```

---

# XLIFF Simple Merge (Forked)

This program automates the merging of XLIFF files (version 1.2 and 2.0). 
New translations from the input file (e.g. "messages.xlf") are merged into the destination file (e.g "messages.fr-FR.xlf"), while keeping exising translations intact. 
~~Removed translations will be removed in the input file.~~

This can be used as post-processing to angular i18n extraction, to update translations files.

## Usage

Either install via `npm i -g xliff-simple-merge` or run directly with `npx xliff-simple-merge`.

```text
Options:
  -i, --input-file <inputFile>              input file/merge origin
  -d, --destination-file <destinationFile>  merge destination
  -o, --output-file <outputFile>            output file, if not provided "merge destination" is overwritten
  --no-remove-unused                        prevent remove unused trans-unit id of destination file during merge
  --no-match-fuzzy                          prevent fuzzy matching of similar units with changed id
  --no-collapse-whitespace                  prevent collapsing of multiple whitespaces and trimming when comparing translations sources
  --no-reset-translation-state              prevent (re-)setting the translation state to new/initial for new/changed units
  --no-replace-apostrophe                   prevent replacing of apostrophes (') with "&apos;"
  --new-target-blank                        new translation targets should be blank
  --debug                                   enable debug output
  -h, --help                                display help for command
```
