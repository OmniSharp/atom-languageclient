/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Autocomplete } from './IAutoCompleteService';

export namespace Finder {
    export interface Item {
        name: string;
        containerName?: string;
        type: Autocomplete.SuggestionType;
        filePath: string;
        iconHTML?: string;
        location?: TextBuffer.Point;
        filterText: string;
        className?: string;
    }
}
