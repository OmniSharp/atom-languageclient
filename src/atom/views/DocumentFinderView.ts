/**
 *
 */
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { AutocompleteKind } from 'atom-languageservices';
import { packageName } from '../../constants';
import { AtomCommands } from '../AtomCommands';
import { AtomNavigation } from '../AtomNavigation';
import { FilterSelectListView } from './FilterSelectListView';

export class DocumentFinderView extends FilterSelectListView<Finder.Symbol> {
    private _navigation: AtomNavigation;
    private _subscription: Subscription;
    private _panel: Atom.Panel;
    constructor(commands: AtomCommands, navigation: AtomNavigation, results: Observable<Finder.Symbol[]>) {
        super(commands);
        this._navigation = navigation;
        this._subscription = results.subscribe(items => {
            this.setFilterItems(items);
        });
        this._filterEditorView.getModel().buffer.onDidChange(() => {
            this.populateList(this._filterEditorView.getModel().getText());
        });

        this.storeFocusedElement();
        this._panel = atom.workspace.addModalPanel({ item: this.root });
        this.focusFilterEditor();
    }

    public get filterKeys() {
        return [
            { name: 'filterText', weight: 0.4 },
            { name: 'name', weight: 0.6 }
        ];
    }

    public cancelled() {
        this._subscription.unsubscribe();
        this._panel.destroy();
    }

    public confirmed(item: Finder.Symbol) {
        this._subscription.unsubscribe();
        this._navigation.navigateTo(item);
    }

    public viewForItem(result: fuse.Result<Finder.Symbol>) {
        const {item, matches} = result;
        const li = document.createElement('li');
        let filename = atom.project.relativizePath(item.filePath)[1];
        if (item.location) {
            filename += ': ' + item.location.row;
        }

        const filenameContent = filename;
        let nameContent = item.name;

        // const pathMatches = _.find(matches!, { key: 'filePath' });
        // if (pathMatches) {
        //     filenameContent = this._getMatchString(filenameContent, pathMatches);
        // }
        const nameMatches = _.find(matches!, { key: 'name' });
        if (nameMatches) {
            nameContent = this._getMatchString(nameContent, nameMatches);
        }
        /* tslint:disable-next-line:no-inner-html */
        li.innerHTML = `
            <span>${item.iconHTML || this._renderIcon(item)}<span>${nameContent}</span></span><br/>
            <span class="filename">${filenameContent}</span>
            `;

        return li;
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

    private _renderIcon(completionItem: { type?: Autocomplete.SuggestionType; }) {
        return `<img height="16px" width="16px" src="atom://${packageName}/styles/icons/${this._getIconFromKind(completionItem.type!)}.svg" />`;
    }

    private _getIconFromKind(kind: Autocomplete.SuggestionType): string {
        switch (kind) {
            case 'class':
            case 'type':
                return AutocompleteKind.Class;
            case 'mixin':
                return 'union';
            case 'constant':
                return 'constant';
            case 'import':
                return 'reference';
            case 'keyword':
                return 'keyword';
            case 'function':
            case 'method':
                return AutocompleteKind.Method;
            case 'module':
            case 'require':
            case 'package':
                return AutocompleteKind.Module;
            case 'property':
                return AutocompleteKind.Property;
            case 'snippet':
                return 'snippet';
            case 'tag':
                return AutocompleteKind.Class;
            case 'selector':
            case 'pseudo-selector':
            case 'variable':
                return AutocompleteKind.Field;
            case 'interface':
                return AutocompleteKind.Interface;
            case 'enum':
                return AutocompleteKind.Enum;
            case 'value':
            case 'attribute':
            case 'builtin':
            default:
                return 'valuetype';
        }
    }
}
