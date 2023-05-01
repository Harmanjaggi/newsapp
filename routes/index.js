const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const router = express.Router()

const SALT_ROUNDS = 10

router.get('/', async (req, res) =>
{
    res.render('index', { articles: articles })
    let articles = await db.any('SELECT articleid, title, body FROM articles')
    res.render('index', { articles: articles })
})

router.get('/logout', (req, res, next) =>
{
    if (req, session)
    {
        req.session.destroy((error) =>
        {
            if (error) next(error)
            else res.redirect('/login')
        })
    }
})


router.get('/register', (req, res) =>
{
    res.render('register')
})

router.post('/register', async (req, res) =>
{
    let username = req.body.username
    let password = req.body.password

    let user = await db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username])
    if (user)
    {
        res.render('register', { message: "User name already exists!" })
    } else
    {
        // insert user into the users table
        bcrypt.hash(password, SALT_ROUNDS, async function (error, hash)
        {
            if (error == null)
            {
                await db.none('INSERT INTO users(username,password) VALUES($1,$2)', [username, hash])
                res.send('SUCCESS')
            }
        })
    }
})

router.get('/login', (req, res) =>
{
    res.render('login')
})

router.post('/login', async (req, res) =>
{
    let username = req.body.username
    let password = req.body.password

    let user = await db.oneOrNone('SELECT userid, username, password FROM users WHERE username = $1', [username])
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

module.exports = router