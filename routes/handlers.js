const Response = require('../utils/response');
const errors = require('../utils/errors');

module.exports = {
  error
};

function error (err, req, res, next) {
  if (err instanceof errors.AuthenticationError) {
    res.status(401).json(Response.error(401, 'Unauthorized'));
  } else if (err instanceof errors.AuthorizationError) {
    res.status(403).json(Response.error(403, 'Forbidden'));
  } else if (err instanceof errors.ValidationError) {
    res.status(422).json(Response.error(422, 'Validation error', err.errors()));
  } else if (err instanceof errors.NotFoundError) {
    res.status(404).json(Response.error(404, 'Not found'));
  } else {
    console.log(err.stack);

    const status = err.status || 500;
    const error = (process.env.ENV === 'development') ? err : null;
    res.status(status).json(Response.error(status, 'Error', error));
  }
}
