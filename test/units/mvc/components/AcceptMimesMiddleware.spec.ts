import {assert, expect} from "chai";
import {AcceptMimesMiddleware} from "../../../../src/mvc/components/AcceptMimesMiddleware";
import {MiddlewareService} from "../../../../src/mvc/services/MiddlewareService";
import {inject} from "../../../../src/testing";
import {FakeRequest} from "../../../helper";

describe("AcceptMimesMiddleware", () => {

    before(inject([MiddlewareService], (middlewareService: MiddlewareService) => {
        this.middleware = middlewareService.invoke<AcceptMimesMiddleware>(AcceptMimesMiddleware);
        this.request = new FakeRequest();
        this.request.mime = "application/json";
    }));

    after(() => {
        delete this.middleware;
        delete this.request;
    });

    it("should accept mime and return nothing when 'application/json' is configured", () => {

        expect(this.middleware.use({
            store: {
                get: () => {
                    return ["application/json"];
                }
            }
        }, this.request)).to.eq(undefined);

    });

    it("should accept mime and return nothing when nothing is configured", () => {

        expect(this.middleware.use({
                store: {
                    get: () => {
                        return undefined;
                    }
                }
            },
            this.request)
        ).to.eq(undefined);

    });


    it("should not accept mime and throw a NotAcceptable error", () => {

        assert.throws(() => {
            this.middleware.use({
                store: {
                    get: () => {
                        return ["application/xml"];
                    }
                }
            }, this.request);
        }, "You must accept content-type application/xml");

    });

});