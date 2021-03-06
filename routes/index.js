'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./users');
const h = require('./handlers');
const val = require('../validators');
const session = require('./session');
const authc = require('./authc');
const resources = require('./resources');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(session);

const baseUrl = '/api/v1';

router.post(`${baseUrl}/users/register`, val.users.register, userRoutes.register);
router.post(`${baseUrl}/users/login`, val.users.login, userRoutes.login);
router.post(`${baseUrl}/users/login1`, authc.service, val.users.login1, userRoutes.login1);
router.post(`${baseUrl}/users/logout`, userRoutes.logout);

router.post(`${baseUrl}/users/:id/exchange/:exchangeId`, val.users.registerUserCredentials, authc.service, authc.user, userRoutes.registerUserCredentials);

router.post(`${baseUrl}/users/:id/set_balance`, authc.service, authc.user, val.users.setBalance, userRoutes.setUserAccountBalance);
router.get(`${baseUrl}/users/:id/get_balance`, authc.service, authc.user, val.users.getBalance, userRoutes.getUserAccountBalance);

// resourses for front
router.get(`${baseUrl}/resources/`, resources.getResources);

router.use(h.error);

module.exports = router;
