/**
 * @module common/mvc
 */
/** */
import {Metadata} from "../../core/class/Metadata";
import {Type} from "../../core/interfaces";
import {ParamMetadata} from "../class/ParamMetadata";
import {EXPRESS_NEXT_FN, PARAM_METADATA} from "../constants";
import {IInjectableParamSettings, IParamArgs} from "../interfaces";

export class ParamRegistry {
    /**
     *
     * @param target
     * @param targetKey
     * @param index
     * @returns {any}
     */
    static get(target: Type<any>, targetKey: string | symbol, index: number): ParamMetadata {

        const params = this.getParams(target, targetKey);

        params[index] = params[index] || new ParamMetadata(target, targetKey, index);

        return params[index];

    }

    /**
     *
     * @param target
     * @param targetKey
     * @returns {Array}
     */
    static getParams = (target: Type<any>, targetKey: string | symbol): ParamMetadata[] =>
        Metadata.has(PARAM_METADATA, target, targetKey)
            ? Metadata.get(PARAM_METADATA, target, targetKey)
            : [];

    /**
     *
     * @param target
     * @param targetKey
     * @param index
     * @param injectParams
     */
    static set(target: Type<any>, targetKey: string | symbol, index: number, injectParams: ParamMetadata): void {

        const params = Metadata.has(PARAM_METADATA, target, targetKey)
            ? Metadata.get(PARAM_METADATA, target, targetKey)
            : [];

        params[index] = injectParams;

        Metadata.set(PARAM_METADATA, params, target, targetKey);
    }

    /**
     *
     * @param target
     * @param method
     */
    static isInjectable = (target, method): boolean =>
    (Metadata.get(PARAM_METADATA, target, method) || []).length > 0;

    /**
     *
     * @param service
     * @param settings
     */
    static useService(service: symbol, settings: IParamArgs<any>) {
        const param = ParamRegistry.get(settings.target, settings.propertyKey, settings.parameterIndex);
        param.service = service;
        param.useConverter = false;

        ParamRegistry.set(settings.target, settings.propertyKey, settings.parameterIndex, param);
        return this;
    }

    /**
     *
     * @param target
     * @param propertyKey
     * @param parameterIndex
     */
    static required(target: Type<any>, propertyKey: string | symbol, parameterIndex: number) {
        const param = ParamRegistry.get(target, propertyKey, parameterIndex);

        param.required = true;

        ParamRegistry.set(target, propertyKey, parameterIndex, param);

        ParamRegistry.get(target, propertyKey, parameterIndex).store.merge("responses", {
            "400": {
                description: "BadRequest"
            }
        });

        return this;
    }

    /**
     *
     * @param service
     * @param options
     */
    static useFilter(service: Type<any>, options: IInjectableParamSettings<any>): ParamMetadata {
        let {
            propertyKey,
            parameterIndex,
            expression,
            target,
            useType,
            useConverter
        } = options;

        const param = ParamRegistry.get(target, propertyKey, parameterIndex);

        if (typeof expression !== "string") {
            useType = <any>expression;
            expression = undefined;
        }

        param.service = service;
        param.expression = expression;

        if (useType) {
            param.type = useType;
        }

        if (useConverter !== undefined) {
            param.useConverter = useConverter;
        }

        ParamRegistry.set(target, propertyKey, parameterIndex, param);

        return param;
    }

    /**
     *
     * @param target
     * @param propertyKey
     */
    static hasNextFunction = (target: Type<any>, propertyKey: string) =>
    ParamRegistry
        .getParams(target, propertyKey)
        .findIndex((p) => p.service === EXPRESS_NEXT_FN) > -1;
}