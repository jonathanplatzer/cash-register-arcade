module.exports = function(lineman) {
    return {

        // JSDoc
        loadNpmTasks: ["grunt-jsdoc"],
        appendTasks: {
            dist: ["jsdoc"]
        },
        jsdoc: {
            dist: {
                src: ["app/js/**/*.js"],
                options: {
                    destination: "doc"
                }
            }
        },
        clean: {
            dist: {
                src: ["dist", "doc", "generated"]
            }
        },

        // API Proxying
        //
        // During development, you'll likely want to make XHR (AJAX) requests to an API on the same
        // port as your lineman development server. By enabling the API proxy and setting the port, all
        // requests for paths that don't match a static asset in ./generated will be forwarded to
        // whatever service might be running on the specified port.
        //
        // server: {
        //   apiProxy: {
        //     enabled: true,
        //     host: 'localhost',
        //     port: 3000
        //   }
        // }

        // LiveReload
        //
        // Lineman can LiveReload browsers whenever a file is changed that results in
        // assets to be processed, preventing the need to hit F5/Cmd-R every time you
        // make a change in each browser you're working against. To enable LiveReload,
        // comment out the following line:
        //
        //livereload: true
    };
};
