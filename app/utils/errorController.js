module.exports = (err, req, res, next) => {
    try {
        if (err.code === '23505' && err.constraint === 'employee_pkey') return err = handleUserExistsError(err, res);
        if (err.constraint === 'wage_pkey') return err = handleDuplicatePositionError(err, res);
        if (err.message === 'Username cannot be empty') return err = handleMissingUsernameError(err, res);
        if (err.message === 'Password cannot be empty') return err = handleMissingPasswordError(err, res);
        if (err.message === 'Password is not long enough') return err = handleWeakPasswordError(err, res);

        return next(err);
    }
    catch (err) {
        return res
            .status(500)
            .send('An unknown error occurred.');
    }

}

const handleUserExistsError = (err, res) => {
    const error = 'Sorry, that username is taken.';
    return res.status(409).send({ message: error });
}

const handleMissingUsernameError = (err, res) => {
    const error = 'Username cannot be empty.';
    return res.status(409).send({ message: error });
}

const handleMissingPasswordError = (err, res) => {
    const error = 'Password cannot be empty.';
    return res.status(409).send({ message: error });
}

const handleWeakPasswordError = (err, res) => {
    const error = `Password must be at least 8 characters long.`;
    return res.status(409).send({ message: error });
}

const handleDuplicatePositionError = (err, res) => {
    const error = `That position already exists.`;
    return res.status(409).send({ message: error });
}
