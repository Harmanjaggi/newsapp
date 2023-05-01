function checkAuthorization (req, res, next)
{
    if (req.session && req.session.user)
    {
        res.locals.authenticated = true
        next()
    }
    else
        res.redirect('/login')
}

module.exports = checkAuthorization