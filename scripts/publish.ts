/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';

const root = resolve(__dirname, '..');
const languageservices = resolve(root, 'atom-languageservices');
process.env.PATH = `${resolve(root, 'node_modules', '.bin')};${process.env.PATH}`;

process.chdir(languageservices);
execSync('npm install');
execSync('npm version patch');
execSync('npm publish');

process.chdir(root);
execSync('apm publish patch');
