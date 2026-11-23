"use strict";

/* Normalizes Shadowrocket, Quantumult X, and Loon script globals. */
var G1Host = (function () {
  var name = detectHost();

  function detectHost() {
    if (typeof $task !== "undefined") return "quantumultx";
    if (typeof $loon !== "undefined") return "loon";
    return "shadowrocket";
  }

  function label() {
    if (name === "quantumultx") return "Quantumult X";
    if (name === "loon") return "Loon";
    return "Shadowrocket";
  }

  function canRead() {
    if (name === "quantumultx") {
      return typeof $prefs !== "undefined" && typeof $prefs.valueForKey === "function";
    }
    return typeof $persistentStore !== "undefined" && typeof $persistentStore.read === "function";
  }

  function read(key) {
    if (name === "quantumultx") return $prefs.valueForKey(key);
    return $persistentStore.read(key);
  }

  function write(value, key) {
    if (name === "quantumultx") {
      if (typeof $prefs === "undefined" || typeof $prefs.setValueForKey !== "function") {
        throw new Error("persistent store unavailable");
      }
      return $prefs.setValueForKey(value, key);
    }
    if (typeof $persistentStore === "undefined" || typeof $persistentStore.write !== "function") {
      throw new Error("persistent store unavailable");
    }
    return $persistentStore.write(value, key);
  }

  function requestUrl() {
    return typeof $request === "object" && $request ? $request.url : "";
  }

  function responseBody() {
    return typeof $response === "object" && $response ? $response.body : undefined;
  }

  // Quantumult X script-response-body drops the body when $done omits it.
  function finishUnchanged() {
    var body = responseBody();
    if (name === "quantumultx" && typeof body === "string") {
      $done({ body: body });
      return;
    }
    $done({});
  }

  function finishRewrite(body) {
    if (typeof body !== "string") {
      finishUnchanged();
      return;
    }
    $done({ body: body });
  }

  function finishPassthrough() {
    $done({});
  }

  // Shadowrocket and Loon mock responses use response.status.
  // Quantumult X script-echo-response uses a status line string.
  function finishResponse(status, headers, body) {
    if (name === "quantumultx") {
      $done({ status: "HTTP/1.1 " + status + " OK", headers: headers, body: body });
      return;
    }
    $done({ response: { status: status, headers: headers, body: body } });
  }

  return {
    name: name,
    label: label,
    canRead: canRead,
    read: read,
    write: write,
    requestUrl: requestUrl,
    responseBody: responseBody,
    finishUnchanged: finishUnchanged,
    finishRewrite: finishRewrite,
    finishPassthrough: finishPassthrough,
    finishResponse: finishResponse
  };
})();
