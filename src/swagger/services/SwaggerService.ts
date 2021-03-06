/**
 * @module swagger
 */
/** */
import * as Fs from "fs";
import * as PathUtils from "path";
import {Info, Schema, Spec} from "swagger-schema-official";
import {$log} from "ts-log-debug";
import {ExpressApplication} from "../../core/services/ExpressApplication";
import {deepExtends} from "../../core/utils";
import {Inject} from "../../di/decorators/inject";
import {Service} from "../../di/decorators/service";
import {ControllerProvider} from "../../mvc/class/ControllerProvider";
import {EndpointMetadata} from "../../mvc/class/EndpointMetadata";
import {ControllerService} from "../../mvc/services/ControllerService";
import {ServerSettingsService} from "../../server/services/ServerSettingsService";
import {OpenApiEndpointBuilder} from "../class/OpenApiEndpointBuilder";
import {ISwaggerPaths, ISwaggerSettings} from "../interfaces";
import {getReducers} from "../utils";


@Service()
export class SwaggerService {

    constructor(private controllerService: ControllerService,
                private serverSettingsService: ServerSettingsService,
                @Inject(ExpressApplication) private expressApplication: ExpressApplication) {

    }

    private middleware() {
        return require("swagger-ui-express");
    }

    /**
     *
     */
    $afterRoutesInit() {
        const conf = this.serverSettingsService.get<ISwaggerSettings>("swagger");
        const host = this.serverSettingsService.getHttpPort();
        const path = conf && conf.path || "/docs";

        $log.info(`Swagger Json is available on http://${host.address}:${host.port}${path}/swagger.json`);
        this.expressApplication.get(`${path}/swagger.json`, this.onRequest);

        if (conf) {
            let cssContent;

            if (conf.cssPath) {
                cssContent = Fs.readFileSync(PathUtils.resolve(this.serverSettingsService.resolve(conf.cssPath)), {encoding: "utf8"});
            }

            const spec = this.getOpenAPISpec();

            $log.info(`Swagger UI is available on http://${host.address}:${host.port}${path}`);

            this.expressApplication.use(path, this.middleware().serve);
            this.expressApplication.get(path, this.middleware().setup(spec, conf.showExplorer, conf.options || {}, cssContent));

            if (conf.specPath) {
                Fs.writeFileSync(conf.specPath, JSON.stringify(spec, null, 2));
            }
        }

    }

    private onRequest = (req, res, next) => {
        if (req.url.indexOf("swagger.json") > -1) {
            const content = this.getOpenAPISpec();
            res.status(200).json(content);
            next();
        }
    };

    /**
     *
     * @returns {Spec}
     */
    public getOpenAPISpec(): Spec {
        const defaultSpec = this.getDefaultSpec();
        const paths: ISwaggerPaths = {};
        const definitions = {};

        this.controllerService.forEach((provider: ControllerProvider) => {
            if (!provider.hasParent()) {
                provider.routerPaths.forEach(path => {
                    this.buildRoutes(paths, definitions, provider, provider.getEndpointUrl(path));
                });
            }
        });

        return deepExtends(
            defaultSpec,
            {
                paths,
                definitions
            },
            getReducers()
        );
    }

    private readSpecPath(path: string) {
        path = this.serverSettingsService.resolve(path);
        if (Fs.existsSync(path)) {
            const json = Fs.readFileSync(path, {encoding: "utf8"});
            /* istanbul ignore else */
            if (json !== "") {
                return JSON.parse(json);
            }
        }
        return {};
    }

    /**
     * Return the global api information.
     * @returns {Info}
     */
    public getDefaultSpec(): Spec {
        const {version} = this.serverSettingsService;
        const consumes = this.serverSettingsService.acceptMimes;
        const produces = ["application/json"];
        const {
            spec = {
                info: {},
                securityDefinitions: {}
            }, specPath
        } = this.serverSettingsService.get<ISwaggerSettings>("swagger") || {} as any;
        let specPathContent = {};

        if (specPath) {
            specPathContent = this.readSpecPath(specPath);
        }

        /* istanbul ignore next */
        const {
            title = "Api documentation",
            description = "",
            version: versionInfo,
            termsOfService = "",
            contact,
            license
        } = spec.info || {} as any;

        return deepExtends({
                swagger: "2.0",
                info: {
                    version: versionInfo || version,
                    title,
                    description,
                    termsOfService,
                    contact,
                    license
                },
                consumes,
                produces,
                securityDefinitions: spec.securityDefinitions || {}
            },
            specPathContent,
            getReducers()
        );
    }

    /**
     *
     * @param paths
     * @param definitions
     * @param ctrl
     * @param endpointUrl
     */
    private buildRoutes(paths: ISwaggerPaths, definitions: { [key: string]: Schema }, ctrl: ControllerProvider, endpointUrl: string) {

        ctrl.dependencies
            .map(ctrl => this.controllerService.get(ctrl))
            .forEach((provider: ControllerProvider) =>
                this.buildRoutes(paths, definitions, provider, `${endpointUrl}${provider.path}`)
            );

        ctrl.endpoints.forEach((endpoint: EndpointMetadata) => {

            /* istanbul ignore else */
            if (endpoint.hasHttpMethod()) {
                const builder = new OpenApiEndpointBuilder(endpoint, endpointUrl).build();

                deepExtends(paths, builder.paths);
                deepExtends(definitions, builder.definitions);
            }
        });

    }
}