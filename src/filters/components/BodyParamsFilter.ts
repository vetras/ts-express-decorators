/**
 * @module common/filters
 */
/** */

import {Filter} from "../decorators/filter";
import {IFilter} from "../interfaces";
import {ParseService} from "../services/ParseService";
/**
 * @private
 * @filter
 */
@Filter()
export class BodyParamsFilter implements IFilter {

    constructor(private parseService: ParseService) {
    }

    transform(expression: string, request, response) {
        return this.parseService.eval(expression, request["body"]);
    }
}