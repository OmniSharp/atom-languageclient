/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:variable-name no-any interface-name */

/**
 * Symbol for the internal Linter Service
 */
export const ILinterService = Symbol.for('ILinterService');
export interface ILinterService {
    getLinter(name: string): Linter.IndieLinter;
}

export namespace Linter {
    export interface MessageBase {
        type: string;
        filePath: string;
        range: TextBuffer.Range;
        name?: string;
        trace?: Message[];
        severity: 'error' | 'warning' | 'info';
        selected?: ((message: Message) => void);
        code?: string | number;
    }
    export interface TextMessage extends MessageBase { text: string; }
    export interface HtmlMessage extends MessageBase { html: string; }
    export type Message = TextMessage | HtmlMessage;

    export interface IndieRegistry {
        register(options: { name: string; }): IndieLinter;
    }

    export interface IndieLinter {
        setMessages(messages: Message[]): void;
        deleteMessages(): void;
        dispose(): void;
    }
}
