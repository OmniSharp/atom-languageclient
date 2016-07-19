/**
 *
 */
import { Observable, Subscription } from 'rxjs';
import { NextObserver } from 'rxjs/Observer';
import { filter } from 'fuzzaldrin-plus';
import { packageName } from '../../constants';
import { AutocompleteKind } from '../../services/_public';
import { AtomNavigation } from '../AtomNavigation';
import { SelectListView } from './SelectListView';

export class FinderView extends SelectListView<Finder.Symbol> {
    private _navigation: AtomNavigation;
    private _subscription: Subscription;
    constructor(navigation: AtomNavigation, results: Observable<Finder.Symbol[]>, filter$: NextObserver<string>) {
        super();
        this._navigation = navigation;
        this._subscription = results.subscribe(items => {
            this.setItems(items);
        });
        this._filterEditorView.editor.buffer.onDidChange(() => {
            filter$.next(this._filterEditorView.editor.getText());
        });
    }

    public cancelled() {
        this._subscription.unsubscribe();
    }

    public confirmed(item: Finder.Symbol) {
        this._subscription.unsubscribe();
        this._navigation.navigateTo(item);
    }

    public viewForItem(item: Finder.Symbol) {
        const li = document.createElement('li');
        let filename = atom.project.relativizePath(item.filePath)[1];
        if (item.location) {
            filename += ': ' + item.location.row;
        }
        /* tslint:disable-next-line:no-inner-html */
        li.innerHTML = `
            <span>${item.iconHTML || this._renderIcon(item)}<span>${item.name}</span></span><br/>
            <span class="filename">${filename}</span>
            `;

        return li;
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

document.registerElement();
