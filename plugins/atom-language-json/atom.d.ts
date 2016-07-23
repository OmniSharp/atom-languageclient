declare namespace Json {
    export interface Validation {
        "fileMatch": string;
        "url": string;
    }

    export interface SchemaAssociations {
        [index: string]: string[];
    }
}