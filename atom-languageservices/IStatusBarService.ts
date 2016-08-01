/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IDisposable } from 'ts-disposables';

/* tslint:disable:variable-name */
export const IStatusBarService = Symbol.for('IStatusBarService');
export interface IStatusBarService {
    addTile(context: { position: StatusBar.Position; item: HTMLElement; priority: number; }): IDisposable;
}

export namespace StatusBar {
    export enum Position {
        Left,
        Right
    }

    /* tslint:disable:interface-name */
    export interface Api {
        addLeftTile(context: { item: HTMLElement; priority: number; }): Tile;
        addRightTile(context: { item: HTMLElement; priority: number; }): Tile;
        getLeftTiles(): Tile[];
        getRightTiles(): Tile[];
    }

    /* tslint:disable:interface-name */
    export interface Tile {
        getItem(): HTMLElement;
        getPriority(): number;
        destroy(): void;
    }
}
