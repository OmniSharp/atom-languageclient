/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { languageprotocol } from '../../constants';
import { IConnection } from '../../protocol/Connection';

@capability
export class IntelliseSenseProvider {
    private _connection: IConnection;
    constructor( @inject(languageprotocol) connection: IConnection) {
        this._connection = connection;
    }
}
