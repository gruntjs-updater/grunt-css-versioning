module.exports = function (grunt) {
    'use strict';

    var css = require('css');
    var fs = require('fs');

    grunt.file.defaultEncoding = 'utf8';

    grunt.registerMultiTask('cssversioning', 'CSS components versioning grunt task', function () {
        var options = this.options({
            "separator": "--",
            "mergeVersions": true
        });

        var prefixes = [
            {"name": "class", "mask": /^(\.)/},
            {"name": "id", "mask": /^(#)/},
            {"name": "tagClass", "mask": /^([a-z]{1,}\s*\.)/},
            {"name": "tagId", "mask": /^([a-z]{1,}\s*#)/}
        ];

        // Regexp.Exec returns null in case of ineligible file or [fileName, componentName, versioningToken, extention]
        // array e.g. ["tabs--v2.css", "tabs", "v2", "css"] for tabs--v2.css file
        var versionMask = new RegExp("^([a-zA-Z-]+)" + options.separator + "([\\w]+)\\.(css)");

        var done = this.async();

        // TODO: here we should merge classes (not just append) to avoid extra blocks.
        var writeWrappedStyles = function(fileItem, styles) {
            var pathToWrite = fileItem.path;
            if (options.mergeVersions) {
                var componentPathParts = fileItem.path.split('/');
                componentPathParts.pop();
                componentPathParts.push(fileItem.component + ".css");
                pathToWrite = componentPathParts.join('/');
            }
            fs.appendFileSync(pathToWrite, css.stringify(styles), {"encoding": "utf8"});
        };

        var wrapSingleSelector = function(versionPrefix, selector) {
            var selectorPrefix;
            prefixes.forEach(function(prefix) {
                var regexResult = prefix.mask.exec(selector);
                if (regexResult != null) {
                    selectorPrefix = regexResult[1];
                    return false;
                }
            });
            if (!selectorPrefix) {
                return selector
            }
            console.log("selectorPrefix=", selectorPrefix, selector);
            var prefix = selectorPrefix + versionPrefix + options.separator;
            return prefix + selector.replace(selectorPrefix, "");
        };

        var wrapSelector = function(prefix, selector) {
            var selectorParts = selector.split(" ");
            if (selectorParts && selectorParts.length > 1) {
                for (var i = 0; i < selectorParts.length; i++) {
                    selectorParts[i] = wrapSingleSelector(prefix, selectorParts[i]);
                }
                return selectorParts.join(" ");
            } else {
                return wrapSingleSelector(prefix, selector);
            }
            return selector;
        };

        var processCssFile = function(item) {
            var styles = css.parse(item.content);
            if (styles && styles.stylesheet && styles.stylesheet.rules) {
                var cssRules = styles.stylesheet.rules;
                cssRules.forEach(function(cssItem) {
                    if (cssItem && cssItem.type === "rule") {
                        for (var i = 0; i < cssItem.selectors.length; i++) {
                            cssItem.selectors[i] = wrapSelector(item.version, cssItem.selectors[i]);
                        }
                    }
                });
                writeWrappedStyles(item, styles);
            }
        };

        this.files.forEach(function(file) {
            file.src.forEach(function(path) {
                var fileName = path.split("/").pop();
                var regexRes = versionMask.exec(fileName);
                if (regexRes !== null) {
                    var fileEntity = {"path": path, "component": regexRes[1], "version": regexRes[2]};

                    fs.readFile(path, {"encoding": "utf8"}, function(err, data) {
                        if (err) throw err;
                        fileEntity["content"] = data;
                        processCssFile(fileEntity);
                        done(true);
                    });
                }
            });
        });
    });
};

