exports.handleCustomError = (err, req, res, next) => {
    // handle custom errors
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err)
    }
}

exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: '400 Bad Request: Invalid input' });
    } else if (err.code === '23502') {
        res.status(400).send({ msg: '400 Bad Request: malformed body / missing required fields' });
    } else if (err.code === '23503') {
      res.status(404).send({ msg: `404 Not Found` });
    } 
    else {
        next(err);
  };
}

// final err
exports.handleInternalServerError = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
}