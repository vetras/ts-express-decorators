/**
 * @module common/mvc
 */
/** */
import {UseAfter} from "./useAfter";
/**
 * Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an HTTP status code . If not specified, status defaults to “302 “Found”.
 *
 * ```typescript
 *  @Redirect('/foo/bar')
 *  @Redirect(301, 'http://example.com')
 *  private myMethod() {}
 * ```
 * Redirects can be a fully-qualified URL for redirecting to a different site:
 *
 * ```typescript
 *  @Redirect('http://google.com');
 *  private myMethod() {}
 * ```
 *
 * Redirects can be relative to the root of the host name. For example, if the application is on http://example.com/admin/post/new, the following would redirect to the URL http://example.com/admin:
 *
 * ```typescript
 *  @Redirect('/admin');
 * ```
 * Redirects can be relative to the current URL. For example, from http://example.com/blog/admin/ (notice the trailing slash), the following would redirect to the URL http://example.com/blog/admin/post/new.
 *
 * ```typescript
 *  @Redirect('post/new');
 * ```
 *
 * Redirecting to post/new from http://example.com/blog/admin (no trailing slash), will redirect to http://example.com/blog/post/new.
 *
 * If you found the above behavior confusing, think of path segments as directories (with trailing slashes) and files, it will start to make sense.
 *
 * Path-relative redirects are also possible. If you were on http://example.com/admin/post/new, the following would redirect to http//example.com/admin/post:
 *
 * ```typescript
 *  @Redirect('..');
 * ``
 *
 * A back redirection redirects the request back to the referer, defaulting to / when the referer is missing.
 *
 * ```typescript
 *  @Redirect('back');
 * ```
 *
 * @param status
 * @param location
 * @returns {Function}
 * @decorator
 */
export function Redirect(status: string | number, location?: string): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        return UseAfter((request, response, next) => {

            /* istanbul ignore else */
            if (!response.headersSent) {
                if (typeof status === "string") {
                    response.redirect(status);
                } else {
                    response.redirect(status, location);
                }
            }

            next();

        })(target, targetKey, descriptor);
    };
}
