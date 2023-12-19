(function() {
    if ( window.corticon === undefined )
        window.corticon = {};
    if ( window.corticon.util === undefined )
        window.corticon.util = {};
    else
        throw "window.corticon.util should not be used by another jquery plugin";
    /**
     * usage: jQuery.corticon.util.namespace( corticon.xyz );
     * or $.corticon.util.namespace( corticon.xyz );
     * Multiple namespaces can be defined in one call: or $.corticon.util.namespace( corticon.xyz corticon.abc );
     */
    window.corticon.util.namespace = function() {
        var a=arguments, o=null, i, j, d;
        for (i = 0; i < a.length; i = i + 1) {
            d = a[i].split(".");
            o = window;
            for (j = 0; j < d.length; j = j + 1) {
                o[d[j]] = o[d[j]] || {};
                o = o[d[j]];
            }
        }
    };
    window.corticon.util.copyToClipboard = function (selector) {
        const text = $(selector).val();
        navigator.clipboard.writeText(text).then(function(result) {
        }, function(result) {
            console.log("Could not copy to clipboard - probably no privs to do that in this browser !"+result);
        });
    }
})();
