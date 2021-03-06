'use strict';

const Response = require('../utils/response');
const path = require('path');

const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE;
const cache = {};

function getResources (req, res, next) {
  try {
    const lang = res.locals.lang || DEFAULT_LANGUAGE;

    if (typeof cache[lang] === 'undefined') {
      cache[lang] = createResourceMap(lang);
    }

    res.status(200).send(Response.success(cache[lang])).end();
  } catch (err) {
    next(err);
  }
}

function createResourceMap (lang) {
  return {
    ...langIndependant,
    countries: requireResource('countries', lang),
    ui: requireResource('webapp', lang)
  };
}

const langIndependant = {
  calling_code: requireResource('call_codes'),
  document_type: requireResource('document_types')
};

function requireResource (mod, lang) {
  return require(path.join('../resources/', lang || '.', mod));
}

module.exports = {
  getResources
};
