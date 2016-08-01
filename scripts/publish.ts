/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { execSync } from 'child_process';
import { rmdirSync } from 'fs';
import { join, resolve } from 'path';
import { sync as rimraf } from 'rimraf';

const root = resolve(__dirname, '..');
const languageservices = resolve(root, 'atom-languageservices');
process.env.PATH = `${resolve(root, 'node_modules', '.bin')};${process.env.PATH}`;

process.chdir(root);
execSync('tsc');

process.chdir(languageservices);
execSync('npm install');
execSync('npm version patch');
execSync('npm publish');

process.chdir(root);
execSync('tsc -outDir dist');
execSync('git add .');
execSync('git commit -m "prepare publish"');
execSync('npm install');
execSync('apm publish patch');
