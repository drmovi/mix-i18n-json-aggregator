const mix = require("laravel-mix");
const MixI18nAggregator = require("./plugin");
mix.extend('i18n', new MixI18nAggregator());
