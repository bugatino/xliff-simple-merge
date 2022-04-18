#!/usr/bin/env node

import {Command} from 'commander';
import fs from 'fs';
import {merge} from './merge';

const options = new Command()
    .requiredOption('-i, --input-file <inputFile>', 'input file/merge origin')
    .requiredOption('-d, --destination-file <destinationFile>', 'merge destination')
    .option('-o, --output-file <outputFile>', 'output file, if not provided "merge destination" is overwritten')
    .option('--no-remove-unused', 'prevent remove unused trans-unit id of destination file during merge')
    .option('--no-match-fuzzy', 'prevent fuzzy matching of similar units with changed id')
    .option('--no-collapse-whitespace', 'prevent collapsing of multiple whitespaces and trimming when comparing translations sources')
    .option('--no-reset-translation-state', 'prevent (re-)setting the translation state to new/initial for new/changed units')
    .option('--no-replace-apostrophe', 'prevent replacing of apostrophes (\') with "&apos;"')
    .option('--new-target-blank', 'new translation targets should be blank')
    .option('--debug', 'enable debug output')
    .parse()
    .opts();

if (!options.debug) {
    console.debug = () => null;
}

const inFileContent = fs.readFileSync(options.inputFile, {encoding: 'utf8'});
const destFileContent = fs.readFileSync(options.destinationFile, {encoding: 'utf8'});

const outString = merge(inFileContent, destFileContent, {
    removeUnused: options.removeUnused,
    fuzzyMatch: options.matchFuzzy,
    collapseWhitespace: options.collapseWhitespace,
    resetTranslationState: options.resetTranslationState,
    replaceApostrophe: options.replaceApostrophe,
    newTranslationTargetsBlank: options.newTargetBlank,
});

fs.writeFileSync(options.outputFile ?? options.destinationFile, outString, {encoding: 'utf8'});
