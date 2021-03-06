'use strict';

const userServices = require('../services/users');
const totp = require('../services/totp');
const authServices = require('../services/auth');

module.exports = {
  isEqual,
  hasDigits,
  validateUserEmail,
  checkWalletNotExist,
  validateTotpToken,
  validateTotp
};

const digitsRegexp = new RegExp('[0-9]');

function isEqual (paramName) {
  async function equal (value, {req}) {
    if (value !== req.body[paramName]) {
      throw new Error();
    }
  }
  return equal;
}

async function hasDigits (value) {
  if (!digitsRegexp.test(value)) {
    throw new Error();
  }
}

async function validateUserEmail (email) {
  const ok = await userServices.checkIfUserExists(email);

  if (ok) {
    throw new Error();
  }
}

async function checkWalletNotExist (userId, {req}) {
  if (!userId || !req.params.exchangeId) {
    throw new Error();
  }

  const walletAlreadyExists = await userServices.getWallet(userId, req.params.exchangeId);
  console.log(walletAlreadyExists);
  if (walletAlreadyExists) {
    throw new Error();
  }
}

function validateTotpToken (secretName) {
  async function validate (token, {req}) {
    const ok = await totp.validateToken(req.body[secretName], token);

    if (!ok) {
      throw new Error();
    }
  }
  return validate;
}

async function validateTotp (token, {req}) {
  if (!req.session || !req.session.user || !req.session.user.id) {
    throw new Error();
  }

  const userId = req.session.user.id;

  const ok = await authServices.checkTotpToken(userId, token);

  if (!ok) {
    throw new Error();
  }
}
