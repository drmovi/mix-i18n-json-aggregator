const glob = require("glob");
const path = require("path")
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin")

class MixI18nAggregator {
    config = {}
    groups = []

    name() {
        return 'i18n';
    }

    dependencies() {
        return ['glob']
    }

    register(...args) {
        this.config.pattern = args[0];
        this.config.dist = args[1];
    }

    webpackPlugins() {
        const files = glob.sync(this.config.pattern);
        const langs = {};
        files.forEach(key => {
            const lang = path.parse(key).name;
            if (!langs[lang]) {
                langs[lang] = [];
            }
            langs[lang].push(key);
        });
        this.groups = Object.keys(langs).reduce((carry, key) => {
            const langFiles = langs[key];
            let pattern = langFiles[0];
            if (langFiles.length > 1) {
                pattern = `{${langFiles.join(',')}}`
            }
            carry.push({
                pattern: pattern,
                fileName: path.join(this.config.dist, `${key}.json`),
            });
            return carry;
        }, []);
        return new MergeJsonWebpackPlugin({
            encoding: "utf-8",
            debug: true,
            output: {
                groupBy: this.groups
            },
            globOptions: {
                nosort: true,
            },
        });
    }
}

module.exports = MixI18nAggregator;
