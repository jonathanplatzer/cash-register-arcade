module.exports = function(lineman) {
    return {
        js: {
            app: [
                'app/js/Namespace.js',
                'app/js/State/*.js',
                'app/js/**/*.js'
            ]
        }
    };
};
