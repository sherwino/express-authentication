function ensureLoggedInApiVersion (req, res, next ) {
    if (req.isAuthenticated()) {
        next();
        return;
    }

    res.status(401).json({ message: 'gots to be logged in bruh'});
}

module.exports = ensureLoggedInApiVersion;