/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Observer, Subject } from 'rxjs';
import { Highlight, IAtomNavigation, IHighlightService } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { readFile } from 'fs';
import { CompositeDisposable, DisposableBase } from 'ts-disposables';
import { atomConfig } from '../decorators';
import { AtomCommands } from './AtomCommands';
import { AtomConfig } from './AtomConfig';
import { AtomLanguageClientConfig } from '../AtomLanguageClientConfig';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { AtomViewFinder } from './AtomViewFinder';
import { CommandsService } from './CommandsService';
type Location = IAtomNavigation.Location;

@injectable
@alias(IHighlightService)
@atomConfig({
    default: true,
    description: 'Adds support for highlighting important names'
})
export class HighlightService extends DisposableBase implements IHighlightService {
    private _commands: CommandsService;
    private _atomCommands: AtomCommands;
    private _source: AtomTextEditorSource;
    private _config: AtomConfig;
    private _viewFinder: AtomViewFinder;
    private _highlighters = new Set<Highlighter>();

    constructor(config: AtomConfig, atomLanguageClientConfig: AtomLanguageClientConfig, viewFinder: AtomViewFinder, commands: CommandsService, atomCommands: AtomCommands, source: AtomTextEditorSource) {
        super();
        this._config = config;
        this._viewFinder = viewFinder;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;

        this._disposable.add(() => {
            this._highlighters.forEach(item => {
                item.dispose();
            });
        });

        atomLanguageClientConfig.addSection('highlight', {
            type: <'object'>'object',
            properties: {
                'mode': {
                    title: 'Highlighting Mode',
                    description: 'Overlays look better, highlights are faster',
                    type: 'string',
                    default: 'highlight',
                    enum: [
                        { value: 'overlay', description: 'Overlays' },
                        { value: 'highlight', description: 'Highlights' },
                    ]
                }
            }
        });

        this._disposable.add(
            config.onDidChange<'overlay' | 'highlight'>('highlight.mode')
                .subscribe(({ newValue, oldValue }) => {
                    if (oldValue !== newValue) {
                        this._highlighters.forEach(x => x.mode(newValue));
                    }
                })
        );
    }

    public onEnabled() {
        // return this._commands.add(CommandType.TextEditor, 'go-to-definition', 'f12', () => this.open());
        return { dispose() { } };
    }

    public getHighlighter() {
        const highlighter = new Highlighter(this._config.for('editor'), this._config.get<'overlay' | 'highlight'>('highlight.mode'), this._viewFinder, this._source);
        this._highlighters.add(highlighter);
        return highlighter;
    }
}

class Highlighter extends DisposableBase implements Highlight.Highlighter {
    private _highlighters = new Map<Atom.TextEditor, EditorHighlighter>();
    private _config: AtomConfig;
    private _viewFinder: AtomViewFinder;
    private _source: AtomTextEditorSource;
    private _mode: 'overlay' | 'highlight';

    constructor(config: AtomConfig, mode: 'overlay' | 'highlight', viewFinder: AtomViewFinder, source: AtomTextEditorSource) {
        super();
        this._config = config;
        this._viewFinder = viewFinder;
        this._source = source;
        this._disposable.add(() => {
            this._highlighters.clear();
        });
        this._mode = mode;
    }

    public mode(mode: 'overlay' | 'highlight') {
        if (this._highlighters.size) {
            this._highlighters.forEach(x => x.dispose())
            this._highlighters.clear();
        }
        this._mode = mode;
    }

    public updateHighlights(editor: Atom.TextEditor, added: Highlight.Item[], removed: string[]) {
        if (!this._highlighters.has(editor)) {
            const cd = new CompositeDisposable();
            this._disposable.add(cd);
            let highlighter: EditorHighlighter;
            if (this._mode === 'overlay') {
                highlighter = new OverlayEditorHighlighter(this._config, this._viewFinder, this._source, editor);
            } else {
                highlighter = new HighlightEditorHighlighter(this._config, this._viewFinder, editor);
            }
            cd.add(
                highlighter,
                () => {
                    this._highlighters.delete(editor);
                },
                editor.onDidDestroy(() => {
                    cd.dispose();
                })
            );

            this._highlighters.set(editor, highlighter);
        }

        this._highlighters.get(editor) !.setHighlights(added, removed);
    }
}

abstract class EditorHighlighter extends DisposableBase {
    public abstract setHighlights(added: Highlight.Item[], removed: string[]): void;
    protected getClassForKind(kind: string) {
        switch (kind) {
            case 'number':
                return ['constant', 'numeric'];
            case 'struct name':
                return ['support', 'constant', 'numeric', 'identifier', 'struct'];
            case 'enum name':
                return ['support', 'constant', 'numeric', 'identifier', 'enum'];
            case 'identifier':
                return ['identifier'];
            case 'class name':
                return ['support', 'class', 'type', 'identifier'];
            case 'delegate name':
                return ['support', 'class', 'type', 'identifier', 'delegate'];
            case 'interface name':
                return ['support', 'class', 'type', 'identifier', 'interface'];
            case 'preprocessor keyword':
                return ['constant', 'other', 'symbol'];
            case 'excluded code':
                return ['comment', 'block'];
            case 'unused code':
                return ['unused'];
            default:
                console.log('unhandled Kind ' + kind);
        }
        return [];
    }
}

class OverlayEditorHighlighter extends EditorHighlighter {
    private _editor: Atom.TextEditor;
    private _marks = new Map<string, TextBuffer.DisplayMarker>();
    // private _highlightsObserver: Observer<[Highlight.Item[], number[]]>;
    private _decoratorObserver: Observer<[TextBuffer.DisplayMarker, Highlight.Item]>;
    private _config: AtomConfig;
    private _viewFinder: AtomViewFinder;
    private _source: AtomTextEditorSource;
    private _elements: { line: number; item: HTMLElement }[] = [];

    constructor(config: AtomConfig, viewFinder: AtomViewFinder, source: AtomTextEditorSource, editor: Atom.TextEditor) {
        super();
        this._config = config;
        this._viewFinder = viewFinder;
        this._editor = editor;
        this._source = source;
        // const highlights = this._highlightsObserver = new Subject<[Highlight.Item[], number[]]>();
        const decorator = this._decoratorObserver = new Subject<[TextBuffer.DisplayMarker, Highlight.Item]>();

        this._disposable.add(
            () => {
                this._marks.forEach(x => x.destroy());
                this._marks.clear();
            },
            editor.onDidChangeScrollTop(_.debounce(() => {
                _.each(this._elements, ({ line, item }) => {
                    item.style.display = 'none';
                });
            }, 200, { leading: true })),
            editor.onDidChangeScrollTop(_.debounce(() => {
                const element: any = this._viewFinder.getView(this._editor);
                const top = element.getFirstVisibleScreenRow();
                const bottom = element.getLastVisibleScreenRow() - 2;

                _.each(this._elements, ({ line, item }) => {
                    if (!(line <= top || line >= bottom)) {
                        item.style.display = '';
                    }
                });
            }, 200, { trailing: true })),
            decorator
                .bufferToggle(decorator.throttleTime(500), () => Observable.timer(500))
                .subscribe(items => {
                    _.each(items, ([marker, highlight]) => {
                        this._decorateMarker(marker, highlight);
                    });
                })
        );
    }

    private _decorateMarker(marker: TextBuffer.DisplayMarker, highlight: Highlight.Item) {
        if (marker.isDestroyed()) { return; }

        const item = document.createElement('div');
        const text = this._editor.getTextInBufferRange(highlight.range);
        item.classList.add(...this.getClassForKind(highlight.kind));
        item.innerText = text;
        // item.style.fontWeight = 'bold';
        item.style.pointerEvents = 'none';

        this._computeColor(this.getClassForKind(highlight.kind));

        this._elements.push({ line: highlight.range.start.row, item });

        if (this._editor === this._source.activeTextEditor) {
            this._positionElement(marker, highlight.range.start.row, item, highlight);
        } else {
            this._source
                .observeActiveTextEditor
                .filter(x => x === this._editor)
                .take(1)
                .subscribe(() => {
                    this._positionElement(marker, highlight.range.start.row, item, highlight);
                });
        }
    }

    private _positionElement(marker: TextBuffer.DisplayMarker, line: number, item: HTMLElement, highlight: Highlight.Item) {
        const style = window.getComputedStyle(this._viewFinder.getView(this._editor));
        // item.style.backgroundColor = style.backgroundColor;
        item.style.fontSize = style.fontSize;
        item.style.marginTop = `-${style.lineHeight}`;

        const decoration = this._editor.decorateMarker(marker, { type: 'overlay', item, position: 'tail' });

        this._disposable.add(
            decoration.onDidDestroy(() => {
                _.remove(this._elements, (x) => x.item === item);
            })
        );

        const element: any = this._viewFinder.getView(this._editor);
        const top = element.getFirstVisibleScreenRow();
        const bottom = element.getLastVisibleScreenRow() - 2;

        if (line <= top || line >= bottom) {
            item.style.display = 'none';
        } else {
            item.style.display = '';
        }
    }

    public setHighlights(added: Highlight.Item[], removed: string[]) {
        const currentMarks = _.toArray(this._marks.entries());

        _.each(added, highlight => {
            if (highlight.kind === 'identifier') {
                return;
            }

            const item = _.find(currentMarks, ([, marker]) => marker.getBufferRange().isEqual(highlight.range));
            let mark: TextBuffer.DisplayMarker;
            if (!item) {
                mark = this._editor.markBufferRange(highlight.range);
                this._decoratorObserver.next([mark, highlight]);
                this._marks.set(highlight.id, mark);
            } else {
                _.pull(removed, item[0]);
            }
        });

        _.each(removed, id => {
            if (this._marks.has(id)) {
                const mark = this._marks.get(id) !;
                mark.destroy();
                this._marks.delete(id);
            }
        });
    }

    private _colors = new Map<string, string>();
    private _style = document.createElement('style');
    private _computeColor(classes: string[]) {
        if (this._style.parentElement == null) {
            document.head.appendChild(this._style);
            this._style.appendChild(document.createTextNode(''));
        }

        const id = classes.join('.');
        if (this._colors.has(id)) {
            return this._colors.get(id) !;
        }

        const editor = document.querySelector('atom-text-editor');
        const d = document.createElement('div');
        d.classList.add(...classes);
        editor!.appendChild(d);
        const style = window.getComputedStyle(d);
        this._colors.set(id, style.color!);

        if (style.color) {
            const content = `atom-text-editor::shadow .highlight.${id} .region, atom-text-editor .highlight.${id} .region {
                border: 1px solid ${style.color};
                border-radius: 4px;
                border-top-width: 0;
                border-bottom-width: 0;
                margin-left: -2px;
                padding-right: 1px;
                box-sizing: content-box !important;
            }\n`;
            this._style.firstChild!.textContent += content;
        }

        d.remove();
        return style.color;
    }
}

class HighlightEditorHighlighter extends EditorHighlighter {
    private _editor: Atom.TextEditor;
    private _marks = new Map<string, TextBuffer.DisplayMarker>();
    // private _highlightsObserver: Observer<[Highlight.Item[], number[]]>;
    private _decoratorObserver: Observer<[TextBuffer.DisplayMarker, Highlight.Item]>;
    private _config: AtomConfig;
    private _viewFinder: AtomViewFinder;

    constructor(config: AtomConfig, viewFinder: AtomViewFinder, editor: Atom.TextEditor) {
        super();
        this._config = config;
        this._viewFinder = viewFinder;
        this._editor = editor;
        // const highlights = this._highlightsObserver = new Subject<[Highlight.Item[], number[]]>();
        const decorator = this._decoratorObserver = new Subject<[TextBuffer.DisplayMarker, Highlight.Item]>();

        this._disposable.add(
            () => {
                this._marks.forEach(x => x.destroy());
                this._marks.clear();
            },
            decorator
                .bufferToggle(decorator.throttleTime(500), () => Observable.timer(500))
                .subscribe(items => {
                    _.each(items, ([marker, highlight]) => {
                        this._decorateMarker(marker, highlight);
                    });
                })
        );
    }

    private _decorateMarker(marker: TextBuffer.DisplayMarker, highlight: Highlight.Item) {
        if (marker.isDestroyed()) { return; }

        this._computeColor(this.getClassForKind(highlight.kind));
        const decoration = this._editor.decorateMarker(marker, { type: 'highlight', class: this.getClassForKind(highlight.kind).join(' ') });

        this._disposable.add(
            () => decoration.destroy()
        );
    }

    public setHighlights(added: Highlight.Item[], removed: string[]) {
        const currentMarks = _.toArray(this._marks.entries());

        _.each(added, highlight => {
            if (highlight.kind === 'identifier') {
                return;
            }

            const item = _.find(currentMarks, ([, marker]) => marker.getBufferRange().isEqual(highlight.range));
            let mark: TextBuffer.DisplayMarker;
            if (!item) {
                mark = this._editor.markBufferRange(highlight.range);
                this._decoratorObserver.next([mark, highlight]);
                this._marks.set(highlight.id, mark);
            } else {
                _.pull(removed, item[0]);
            }
        });

        _.each(removed, id => {
            if (this._marks.has(id)) {
                const mark = this._marks.get(id) !;
                mark.destroy();
                this._marks.delete(id);
            }
        });
    }

    private _colors = new Map<string, string>();
    private _style = document.createElement('style');
    private _computeColor(classes: string[]) {
        if (this._style.parentElement == null) {
            document.head.appendChild(this._style);
            this._style.appendChild(document.createTextNode(''));
        }

        const id = classes.join('.');
        if (this._colors.has(id)) {
            return this._colors.get(id) !;
        }

        const editor = document.querySelector('atom-text-editor');
        const d = document.createElement('div');
        d.classList.add(...classes);
        editor!.appendChild(d);
        const style = window.getComputedStyle(d);
        this._colors.set(id, style.color!);

        if (style.color) {
            const content = `atom-text-editor::shadow .highlight.${id} .region, atom-text-editor .highlight.${id} .region {
                border: 1px solid ${style.color};
                border-radius: 4px;
                border-top-width: 0;
                border-bottom-width: 0;
                margin-left: -2px;
                padding-right: 1px;
                box-sizing: content-box !important;
            }\n`;
            this._style.firstChild!.textContent += content;
        }

        d.remove();
        return style.color;
    }
}
