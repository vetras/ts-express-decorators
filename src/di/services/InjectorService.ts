/**
 * @module common/di
 */
/** */
import {$log} from "ts-log-debug";
import {nameOf} from "../../core";
import {Metadata} from "../../core/class/Metadata";
import {Registry} from "../../core/class/Registry";
import {Type} from "../../core/interfaces";
import {Provider} from "../class/Provider";
import {InjectionError} from "../errors/InjectionError";
import {IInjectableMethod, IProvider} from "../interfaces";
import {ProviderRegistry, ProxyProviderRegistry} from "../registries/ProviderRegistry";

/**
 * This service contain all services collected by `@Service` or services declared manually with `InjectorService.factory()` or `InjectorService.service()`.
 *
 * ### Example:
 *
 * ```typescript
 * import {InjectorService} from "ts-express-decorators";
 *
 * // Import the services (all services are decorated with @Service()";
 * import MyService1 from "./services/service1";
 * import MyService2 from "./services/service2";
 * import MyService3 from "./services/service3";
 *
 * // When all services is imported you can load InjectorService.
 * InjectorService.load();
 *
 * const myService1 = InjectorService.get<MyService1>(MyServcice1);
 * ```
 *
 * > Note: `ServerLoader` make this automatically when you use `ServerLoader.mount()` method (or settings attributes) and load services and controllers during the starting server.
 *
 */
export class InjectorService extends ProxyProviderRegistry {

    /**
     * Invoke the class and inject all services that required by the class constructor.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "ts-express-decorators";
     * import MyService from "./services";
     *
     * class OtherService {
     *     constructor(injectorService: InjectorService) {
     *          const myService = injectorService.invoke<MyService>(MyService);
     *      }
     *  }
     * ```
     *
     * @param target The injectable class to invoke. Class parameters are injected according constructor signature.
     * @param locals  Optional object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
     * @param designParamTypes Optional object. List of injectable types.
     * @returns {T} The class constructed.
     */
    public invoke<T>(target: any, locals: Map<Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {
        return InjectorService.invoke<T>(target, locals, designParamTypes);
    }

    /**
     * Invoke a class method and inject service.
     *
     * #### IInjectableMethod options
     *
     * * **target**: Optional. The class instance.
     * * **methodName**: `string` Optional. The method name.
     * * **designParamTypes**: `any[]` Optional. List of injectable types.
     * * **locals**: `Map<Function, any>` Optional. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "ts-express-decorators";
     *
     * class MyService {
     *      constructor(injectorService: InjectorService) {
     *          injectorService.invokeMethod(this.method, {
     *              this,
     *              methodName: 'method'
     *          });
     *      }
     *
     *   method(otherService: OtherService) {}
     * }
     * ```
     *
     * @returns {any}
     * @param handler The injectable method to invoke. Method parameters are injected according method signature.
     * @param options Object to configure the invocation.
     */
    public invokeMethod(handler: any, options: IInjectableMethod<any> | any[]): any {
        return InjectorService.invokeMethod(handler, options);
    }

    /**
     * Get a service or factory already constructed from his symbol or class.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "ts-express-decorators";
     * import MyService from "./services";
     *
     * class OtherService {
     *      constructor(injectorService: InjectorService) {
     *          const myService = injectorService.get<MyService>(MyService);
     *      }
     * }
     * ```
     *
     * @param target The class or symbol registered in InjectorService.
     * @returns {boolean}
     */
    public get<T>(target: Type<T> | symbol): T {
        return super.get(target).instance;
    }

    /**
     * Emit an event to all service. See service [lifecycle hooks](docs/services/lifecycle-hooks.md).
     * @param eventName The event name to emit at all services.
     * @param args List of the parameters to give to each services.
     * @returns {Promise<any[]>} A list of promises.
     */
    public emit(eventName, ...args) {
        return InjectorService.emit(eventName, ...args);
    }

    /**
     * Initialize injectorService and load all services/factories.
     */
    public load(): InjectorService {
        InjectorService.load();
        return this;
    }

    /**
     * Invoke the class and inject all services that required by the class constructor.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "ts-express-decorators";
     * import MyService from "./services";
     *
     * class OtherService {
     *     constructor(injectorService: InjectorService) {
     *          const myService = injectorService.invoke<MyService>(MyService);
     *      }
     *  }
     * ```
     *
     * @param target The injectable class to invoke. Class parameters are injected according constructor signature.
     * @param locals  Optional object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
     * @param designParamTypes Optional object. List of injectable types.
     * @returns {T} The class constructed.
     */
    static invoke<T>(target: any, locals: Map<string | Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {

        if (!designParamTypes) {
            designParamTypes = Metadata.getParamTypes(target);
        }

        const services = designParamTypes
            .map((serviceType: any) => {

                const serviceName = typeof serviceType === "function" ? nameOf(serviceType) : serviceType;

                /* istanbul ignore next */
                if (locals.has(serviceName)) {
                    return locals.get(serviceName);
                }

                if (locals.has(serviceType)) {
                    return locals.get(serviceType);
                }

                /* istanbul ignore next */
                if (!this.has(serviceType)) {
                    throw new InjectionError(target, serviceName.toString());
                }

                return this.get(serviceType);
            });

        return new target(...services);
    }

    /**
     * Invoke a class method and inject service.
     *
     * #### IInjectableMethod options
     *
     * * **target**: Optional. The class instance.
     * * **methodName**: `string` Optional. The method name.
     * * **designParamTypes**: `any[]` Optional. List of injectable types.
     * * **locals**: `Map<Function, any>` Optional. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "ts-express-decorators";
     *
     * class MyService {
     *      constructor(injectorService: InjectorService) {
     *          injectorService.invokeMethod(this.method, {
     *              this,
     *              methodName: 'method'
     *          });
     *      }
     *
     *   method(otherService: OtherService) {}
     * }
     * ```
     *
     * @returns {any}
     * @param handler The injectable method to invoke. Method parameters are injected according method signature.
     * @param options Object to configure the invocation.
     */
    static invokeMethod(handler: any, options: IInjectableMethod<any> | any[]) {

        let designParamTypes, target, methodName, locals;

        if (options instanceof Array) {
            designParamTypes = options as Array<any>;
        } else {
            designParamTypes = options.designParamTypes;
            target = options.target;
            methodName = options.methodName;
            locals = options.locals;
        }

        if (locals instanceof Map === false) {
            locals = new Map();
        }

        if (handler.$injected) {
            return handler.call(target, locals);
        }

        if (!designParamTypes) {
            designParamTypes = Metadata.getParamTypes(target, methodName);
        }

        const services = designParamTypes
            .map((serviceType: any) => {

                const serviceName = typeof serviceType === "function" ? nameOf(serviceType) : serviceType;

                /* istanbul ignore next */
                if (locals.has(serviceName)) {
                    return locals.get(serviceName);
                }

                if (locals.has(serviceType)) {
                    return locals.get(serviceType);
                }

                /* istanbul ignore next */
                if (!this.has(serviceType)) {
                    return undefined;
                }

                return this.get(serviceType);

            });

        return handler(...services);
    }

    /**
     * Construct the service with his dependencies.
     * @param target The service to be built.
     */
    static construct<T>(target: Type<any> | symbol): T {

        const provider: Provider<any> = ProviderRegistry.get(target);

        /* istanbul ignore else */
        return this.invoke<any>(provider.useClass);
    }

    /**
     * @hidden
     * @param registry
     * @param callback
     */
    static buildRegistry(registry: Registry<Provider<any>, any>, callback: (provider: Provider<any>) => boolean = () => true): Registry<Provider<any>, any> {
        registry.forEach(provider => {
            if (typeof callback && callback(provider)) {
                provider.instance = InjectorService.invoke(provider.useClass);
            }

            const token = nameOf(provider.provide);
            const useClass = nameOf(provider.useClass);

            $log.debug(nameOf(provider.provide), "built", token === useClass ? "" : `from class ${useClass}`);

        });

        return registry;
    }

    /**
     * Set a new provider from providerSetting.
     * @param provider provide token.
     * @param instance Instance
     */
    static set(provider: IProvider<any> | any, instance?: any) {
        let target;

        if (provider["provide"] === undefined) {

            target = provider;

            provider = <IProvider<any>>{
                provide: target,
                useClass: target,
                instance: instance || target,
                type: "factory"
            };

        } else {
            target = provider.provide;
        }

        ProviderRegistry.merge(provider.provide, provider);

        return InjectorService;
    }

    /**
     * Get a service or factory already constructed from his symbol or class.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "ts-express-decorators";
     * import MyService from "./services";
     *
     * class OtherService {
     *      constructor(injectorService: InjectorService) {
     *          const myService = injectorService.get<MyService>(MyService);
     *      }
     * }
     * ```
     *
     * @param target The class or symbol registered in InjectorService.
     * @returns {boolean}
     */
    static get = <T>(target: any): T =>
        ProviderRegistry.get(target).instance;

    /**
     * Check if the service of factory exists in `InjectorService`.
     *
     * #### Example
     *
     * ```typescript
     *      import {InjectorService} from "ts-express-decorators";
     *      import MyService from "./services";
     *
     *      class OtherService {
     *    constructor(injectorService: InjectorService) {
     *
     *       const exists = injectorService.has(MyService); // true or false
     *
     *    }
     * }
     * ```
     *
     * @param target The service class
     * @returns {boolean}
     */
    static has = (target: any): boolean =>
        ProviderRegistry.has(target);

    /**
     * Initialize injectorService and load all services/factories.
     */
    static async load() {

        this.buildRegistry(
            ProviderRegistry,
            (provider) => provider.instance === undefined || provider.type === "service"
        );

        return this.emit("$onInjectorReady");
    }

    /**
     * Emit an event to all service. See service [lifecycle hooks](docs/services/lifecycle-hooks.md).
     * @param eventName The event name to emit at all services.
     * @param args List of the parameters to give to each services.
     * @returns {Promise<any[]>} A list of promises.
     */
    static async emit(eventName: string, ...args): Promise<any[]> {
        const promises = [];

        ProviderRegistry.forEach((provider: IProvider<any>) => {

            const service = InjectorService.get<any>(provider.provide);

            if (eventName in service) {
                promises.push(service[eventName](...args));
            }
        });

        return Promise.all(promises);
    }

    /**
     * Add a new service in the registry. This service will be constructed when `InjectorService` will loaded.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "ts-express-decorators";
     *
     * export default class MyFooService {
     *     constructor(){}
     *     getFoo() {
     *         return "test";
     *     }
     * }
     *
     * InjectorService.service(MyFooService);
     * InjectorService.load();
     *
     * const myFooService = InjectorService.get<MyFooService>(MyFooService);
     * myFooService.getFoo(); // test
     * ```
     *
     * @param target The class to add in registry.
     */
    static service = (target: any) =>
        InjectorService.set({provide: target, useClass: target, type: "service"});

    /**
     * Add a new factory in `InjectorService` registry.
     *
     * #### Example with symbol definition
     *
     * ```typescript
     * import {InjectorService} from "ts-express-decorators";
     *
     * export interface IMyFooFactory {
     *    getFoo(): string;
     * }
     *
     * export type MyFooFactory = IMyFooFactory;
     * export const MyFooFactory = Symbol("MyFooFactory");
     *
     * InjectorService.factory(MyFooFactory, {
     *      getFoo:  () => "test"
     * });
     *
     * @Service()
     * export class OtherService {
     *      constructor(@Inject(MyFooFactory) myFooFactory: MyFooFactory){
     *          console.log(myFooFactory.getFoo()); /// "test"
     *      }
     * }
     * ```
     *
     * > Note: When you use the factory method with Symbol definition, you must use the `@Inject()` decorator to retrieve your factory in another Service. Advice: By convention all factory class name will be prefixed by `Factory`.
     *
     * #### Example with class
     * ```typescript
     * import {InjectorService} from "ts-express-decorators";
     *
     * export class MyFooService {
     *  constructor(){}
     *      getFoo() {
     *          return "test";
     *      }
     * }
     *
     * InjectorService.factory(MyFooService, new MyFooService());
     *
     * @Service()
     * export class OtherService {
     *      constructor(myFooService: MyFooService){
     *          console.log(myFooFactory.getFoo()); /// "test"
     *      }
     * }
     * ```
     *
     */
    static factory = (target: any, instance: any) =>
        InjectorService.set({provide: target, useClass: target, instance: instance, type: "factory"});

}

/**
 * Create the first service InjectorService
 */
InjectorService.factory(InjectorService, new InjectorService());