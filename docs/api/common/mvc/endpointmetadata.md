<header class="symbol-info-header">    <h1 id="endpointmetadata">EndpointMetadata</h1>    <label class="symbol-info-type-label class">Class</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { EndpointMetadata }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://github.com/Romakita/ts-express-decorators/blob/v2.0.0-2/src/mvc/class/EndpointMetadata.ts#L0-L0">                mvc/class/EndpointMetadata.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> EndpointMetadata <span class="token keyword">extends</span> <a href="#api/common/core/storable"><span class="token">Storable</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>_provide<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> _methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    type<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">;</span>
    path<span class="token punctuation">:</span> <a href="#api/common/mvc/pathparamstype"><span class="token">PathParamsType</span></a><span class="token punctuation">;</span>
    httpMethod<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    beforeMiddlewares<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    middlewares<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    afterMiddlewares<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token function">hasHttpMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token function">statusResponse</span><span class="token punctuation">(</span>code<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">before</span><span class="token punctuation">(</span>args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token function">after</span><span class="token punctuation">(</span>args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token function">merge</span><span class="token punctuation">(</span>args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token function">getMetadata</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Description

EndpointMetadata contains metadata about a controller and his method.
Each annotation (@Get, @Body...) attached to a method are stored in a endpoint.
EndpointMetadata convert this metadata to an array which contain arguments to call an Express method.

Example :

   @Controller("/my-path")
   provide MyClass {

       @Get("/")
       @Authenticated()
       public myMethod(){}
   }

### Constructor

Route strategy.

### Members

<div class="method-overview"><pre><code class="typescript-lang">type<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">path<span class="token punctuation">:</span> <a href="#api/common/mvc/pathparamstype"><span class="token">PathParamsType</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">httpMethod<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">beforeMiddlewares<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">middlewares<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">afterMiddlewares<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">hasHttpMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">statusResponse</span><span class="token punctuation">(</span>code<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">before</span><span class="token punctuation">(</span>args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">after</span><span class="token punctuation">(</span>args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">merge</span><span class="token punctuation">(</span>args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre></div>
Store all arguments collected via Annotation.
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">getMetadata</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
Get value for an endpoint method.
