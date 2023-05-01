const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const SALT_ROUNDS = 10

router.get('/', (req, res) =>
{
    db.any('SELECT articleid, title, body FROM articles').then((articles) =>
    {
        res.render('index', { articles: articles })
    })
})

router.get('/register', (req, res) =>
{
    res.render('register')
})

router.post('/register', (req, res) =>
{
    let username = req.body.username
    let password = req.body.password

    db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username]).then((user) =>
    {
        if (user)
        {
            res.render('register', { message: "User name already exists!" })
        } else
        {
            // insert user into the users table
            bcrypt.hash(password, SALT_ROUNDS, function (error, hash)
            {
                if (error == null)
                {
                    db.none('INSERT INTO users(username,password) VALUES($1,$2)', [username, hash]).then(() =>
                    {
                        res.send('SUCCESS')
                    })
                }
            })

        }
    })
})

router.get('/login', (req, res) =>
{
    res.render('login')
})

router.post('/login', (req, res) =>
{
    let username = req.body.username
    let password = req.body.password

    db.oneOrNone('SELECT userid, username, password FROM users WHERE username = $1', [username]).then((user) =>
    {
        if (user)
        { // check for user's password
            bcrypt.compare(password, user.password, function (error, result)
            {
                if (result)
                {
                    // put username and userid in the session
                    if (req.session)
                    {
                        req.session.user = {
                            userId: user.userid,
                            username: user.username,
                        }
                    }
                    res.redirect('/users/articles')
                } else
                {
                    res.render('login', { message: 'Invalid username or password!' })
                }
            })
        } else
        { // user does not exist
            res.render('login', { message: 'Invalid username or password!' })
        }
    })
})

module.exports = router