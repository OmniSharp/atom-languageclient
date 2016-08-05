# Atom Language Client

An implementation of the https://github.com/Microsoft/language-server-protocol/blob/master/protocol.md for the atom editor.


# Architecture

The Language Client does a few things to make development a little easier with atom.

1) The `atom` global is not used in any code, it's always called through an injected service.  This allows for easier unit testing, without having to be running in the specific atom environment.
2) Services work with atom, sometimes wrapping atom packages (such as Autocomplete or Linter).
3) Capabilities work with the services to put all the pieces together.

## `atom-langaugeservices`
This in an npm package that contains the interfaces and symbols for those interfaces, in order to get access to services exposed by the Atom Language Client.

Each service is split into two pieces.

* interface `I<ServiceName>`

  This is the interface defined for the given service.  While the interface is written in TypeScript, that does not mean other packages have to also use TypeScript as long as they implement the same interface, and decorate the class correctly.

* symbol `I<ServiceName>`

  This is a unique symbol, that shares the name of the interface, so that it can be injected.  This works off a small trick with the TypeScript compiler, that allows for code formated like `constructor(@inject(IService) service: IService)`.  With this format, it's very easy to both inject and use a given interface from TypeScript.

### Services
The services are listed under [here](https://github.com/OmniSharp/atom-languageclient/tree/master/atom-languageservices) all services are prefixed with the `I` for their interface implementation.

### Helpers
There are sometimes helper methods to go along with the services, these methods can be useful to ensuring consistent behavior.

### Decorators
There are a set of decorators inherited from [`aurelia/dependency-injection`](https://github.com/aurelia/dependency-injection), as well as a few custom ones.

All the decorators shipped with `aurelia/dependency-injection` are included.  This includes `all`, `autoinject` (mapped as `injectable`), `factory`, `inject`, `lazy`, `newInstance`, `options` and `parent`.

Custom decorators include...
  * `key` - This is used to register a given class with a specific key.  This is useful for registering a set of classes, and resolving them using `all`.
  * `alias` - Allows specifying an alias for a given class, used along side with `injectable`.  This is used mainly to export the service symbols, along with the service class.
  * `capability` - This defines a specific behavior for the language server protocol.  Examples include Auto Complete, Formatting, Rename, etc.   Custom capabilities are supported, and you can register your own.
    Each registered capability will be created for _every_ language server that is running.  If your capability isn't supported by the langauge client, just make sure to not bind any events.  In there may be a way to better opt-out of creating a capability.

## Dependency Injection
Atom Language Client uses Dependency Injection under the covers to make it easier to get access to services, as well as easier to Unit Test code in isolation.

The container of choice is [`aurelia/dependency-injection`](https://github.com/aurelia/dependency-injection) which is fairly flexiable, and so far has exceeded our needs.

When the Language Client starts, we bootstrap any services that we need to either consume or provide to atom.  This includes things like Autocomplete and the Linter, as well as the external facing `IResolver` interface.  These instance services are added to the container, and all other services are loaded asyncronously as we read the directories that contain them.  This allows the package to load fairly quickly, and finish our startup later.

Once the container is finished loading we can bootstrap any language servers that have been provided to us.

For each langauge server, we have create a new child container and register services specific to that server.  This container is populated with the sync expression, the connection, the client as well as the capabilities for the client.  This allows isolation such that each client is in it's own little box.  And when we're done with the client we can easily dispose of it, and it's container.

## Observables
RxJS5 is a key library in use with the Language Client. It not only allows cancelation of async operations, it allows us to poll mutiple servers at once, and update the interface as each service return results, instead of waiting for all of the services.  In some cases this can give results to the user faster, and more often.

Services that support this include `Hover`, `Definition`, `Document Symbols` and `Workspace Symbols`.  This allows all servers to add their own contribution without having to worry about if one server happens to be a little slower at doing the work.  This can be great when more than one server acts on a given file type, for example a language server and a linter server.

## User interface
Currently the UI is trying to be fairly minimal.  Over time the goal is to enhance it on a per server basis, as each server may show different pieces to the user.  Right now most interaction elements are using familar atom features such as the Select List View, and the native linter window.  There are plans to eventually add custom interfaces for showing linter errors for example.
