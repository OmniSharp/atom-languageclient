/**
 *
 */
import * as _ from 'lodash';
import { XHRResponse, getErrorStatusDescription, xhr } from 'request-light';

let defaultAssociations: Json.SchemaAssociations;
export function getDefaults() {

    if (defaultAssociations) {
        return Promise.resolve(defaultAssociations);
    }

    return xhr({
        url: 'http://schemastore.org/api/json/catalog.json'
    }).then(
        response => {
            return JSON.parse(response.responseText);
        },
        (error: XHRResponse) => {
            return error.responseText || getErrorStatusDescription(error.status) || error.toString();
        })
        .then((json: {
            schemas: ({ name: string; fileMatch: string[], url: string })[]
        }) => {
            const associations: Json.SchemaAssociations = {};
            _.each(json.schemas, item => {
                _.each(item.fileMatch, fileMatch => {
                    let association = associations[fileMatch];
                    if (!association) {
                        association = [];
                        associations[fileMatch] = association;
                    }
                    association.push(item.url);
                });
            });
            return (defaultAssociations = associations);
        });
}
