/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol to atom
 */
import './bootstrap';
import { AtomLanguageClientPackage } from './AtomLanguageClientPackage';

module.exports = new AtomLanguageClientPackage();
