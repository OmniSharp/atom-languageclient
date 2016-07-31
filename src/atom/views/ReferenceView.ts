/**
 *
 */
import * as _ from 'lodash';
import { Reference } from 'atom-languageservices';
import { AtomCommands } from '../AtomCommands';
import { AtomNavigation } from '../AtomNavigation';
import { FilterSelectListView } from './FilterSelectListView';

export class ReferenceView extends FilterSelectListView<Reference.IResponse> {
    private _navigation: AtomNavigation;
    private _panel: Atom.Panel;
    constructor(commands: AtomCommands, navigation: AtomNavigation, results: Reference.IResponse[]) {
        super(commands);
        this._navigation = navigation;
        this.setFilterItems(results, this._filterEditorView.getModel().getText());
        this._filterEditorView.getModel().buffer.onDidChange(() => {
            this.populateList(this._filterEditorView.getModel().getText());
        });

        this.storeFocusedElement();
        this._panel = atom.workspace.addModalPanel({ item: this.root });
        this.focusFilterEditor();
    }

    public get filterKeys() {
        return [
            { name: 'filterText', weight: 0.3 },
            { name: 'filePath', weight: 0.2 },
            { name: 'name', weight: 0.5 }
        ];
    }

    public cancelled() {
        this._panel.destroy();
    }

    public confirmed(item: Reference.IResponse) {
        this._navigation.navigateTo(item);
    }

    public viewForItem(result: fuse.Result<Reference.IResponse>) {
        const {item, matches} = result;
        const {lines, range} = item;
        const li = document.createElement('li');
        let filename = atom.project.relativizePath(item.filePath)[1];
        filename += `: ${item.range.start.column}@${item.range.start.row}`;

        let filenameContent = filename;

        const pathMatches = _.find(matches!, { key: 'filePath' });
        if (pathMatches) {
            filenameContent = this._getMatchString(filenameContent, pathMatches);
        }

        /* tslint:disable-next-line:no-inner-html */
        li.innerHTML = `
            ${this._getSymbolString(lines, range)}
            <span class="filename">${filenameContent}</span>
            `;

        return li;
    }

    private _getSymbolString(lines: string[], range: TextBuffer.Range) {
        const first = _.first(lines);
        const last = _.last(lines);
        if (first === last) {
            const text = first;
            const end = range.end.column;
            const start = range.start.column;
            const endStr = text.substr(end + 1);
            const replace = `<span class="character-match">${text.substr(start, end - start + 1)}</span>`;
            const startStr = text.substr(0, start);
            return `${startStr}${replace}${endStr}<br/>`;
        }

        const middle = _.map(lines.slice(1, -1), line => `<span class="character-match">${line}</span><br/>`);
        const start = range.start.column;
        let startStr = first.substr(0, start);
        startStr = `${startStr}<span class="character-match">${first.substr(start)}</span><br/>`;
        const end = range.end.column;
        let endStr = last.substr(end + 1);
        endStr = `<span class="character-match">${last.substr(0, start)}</span>${endStr}<br/>`;
        return [startStr, ...middle, endStr].join('');
    }

    private _getMatchString(text: string, match: fuse.Match) {
        _.each(_.reverse(match.indices), ([start, end]) => {
            const endStr = text.substr(end + 1);
            const replace = `<span class="character-match">${text.substr(start, end - start + 1)}</span>`;
            const startStr = text.substr(0, start);
            text = `${startStr}${replace}${endStr}`;
        });
        return text;
    }
}
