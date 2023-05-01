const express = require('express')
const router = express.Router()

router.post('/delete-article', async (req, res) =>
{
    let articleId = req.body.articleId
    await db.none('DELETE FROM articles WHERE articleid = $1', [articleId])
    res.redirect('/users/articles')
})

router.get('/add-article', (req, res) =>
{
    res.render('add-article')
})

router.post('/add-article', async (req, res) =>
{
    let title = req.body.title
    let description = req.body.description
    let userId = req.session.user.userId

    await db.none('INSERT INTO articles(title,body, userId) VALUES($1, $2, $3)', [title, description, userId])
    res.send("SUCCESS")
})

router.post('/update-article', async (req, res) =>
{
    let title = req.body.title
    let description = req.body.description
    let articleId = req.body.articleId

    await db.none('UPDATE articles SET title = $1, body = $2 WHERE articleid = $3', [title, description, articleId])
    res.redirect('/users/articles')
})

router.get('/articles/edit/:articleId', async (req, res) =>
{
    let articleId = req.params.articleId
    await db.one('SELECT articleid,title,body FROM articles WHERE articleid = $1', [articleId])
    res.render('edit-article', article)
})

router.get('/articles', async (req, res) =>
{
    let userId = req.session.user.userId
    let articles = db.any('SELECT articleid, title, body FROM articles WHERE userid = $1', [userId])
    res.render('articles', { articles: articles })
})

module.exports = router