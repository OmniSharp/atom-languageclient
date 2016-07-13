declare const key: ((key: any) => ClassDecorator);
declare const autoinject: ClassDecorator;
declare const transient: (key?: any) => ClassDecorator;
declare const singleton: {
    (registerInChild?: boolean): ClassDecorator;
    (key: any, registerInChild?: boolean): ClassDecorator;
};
declare const capability: ClassDecorator;
declare const inject: (key?: any) => ParameterDecorator;
declare const all: ParameterDecorator;
declare const factory: ParameterDecorator;
declare const lazy: ParameterDecorator;
declare const newInstance: ParameterDecorator;
declare const optional: ParameterDecorator;

declare namespace NodeJS {
    export interface Global {
        key: ((key: any) => ClassDecorator);
        autoinject: ClassDecorator | ((key: any) => ClassDecorator);
        transient: (key?: any) => ClassDecorator;
        singleton: {
            (registerInChild?: boolean): ClassDecorator;
            (key: any, registerInChild?: boolean): ClassDecorator;
        };
        capability: ClassDecorator;

        inject: (key?: any) => ParameterDecorator;
        all: (key?: any) => ParameterDecorator;
        factory: ParameterDecorator;
        lazy: (key?: any) => ParameterDecorator;
        newInstance: ParameterDecorator | ((asKey?: any) => ParameterDecorator);
        optional: ParameterDecorator | ((checkParent?: boolean) => ParameterDecorator);
    }
}
