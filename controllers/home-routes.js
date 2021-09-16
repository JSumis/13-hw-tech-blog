const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try{
        const allNewPostData = await Post.findAll();

        const newPostData = allNewPostData.map((newpost) => newpost.get({ plain: true }));

        res.render('homepage', {
            newPostData,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/signin', async (req, res) => {
    try{
        res.render('signin', {
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/signup', async (req, res) => {
    try{
        res.render('signup', {
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
    const currId = req.session.user_id;
    try{
        const postRequestData = await Post.findAll({
            where: {user_id: currId},
        });

        const postData = postRequestData.map((poster) => poster.get({ plain: true }));
        res.render('dashboard',
         {
             postData,
            loggedIn: req.session.loggedIn
        })
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/new', withAuth, async (req, res) => {
    try{
        res.render('new-post');
    } catch (err){
        res.status(500).json(err)
    }
});

router.get('/:id', withAuth, async (req, res) => {
    try{
        const postDataId = await Post.findByPk(req.params.id)
        const postData = postDataId.get({ plain: true });
        
        res.render('post', {
            postData,
            loggedIn: req.session.loggedIn,
        })
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', withAuth, async (req, res) => {
    try{
        const postDataId = await Post.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['username'],
            },
            {
                model: Comment,
                include: [User]
            }]
        });
        const postData = postDataId.get({ plain: true });
        const postId = req.session.user_id;
        const urlId = req.params.id;
        const userDataId = await User.findOne({
            where: {id: postDataId.user_id},
        });

        const userData = userDataId.get({ plain: true });

        const userDataCommentId = await User.findOne({
            where: {id: req.session.user_id},
        });

        const userDataComment = userDataCommentId.get({ plain: true });
        
        res.render('single-post', { 
            userDataComment,
            userData,
            postData,
            postId,
            urlId,
            loggedIn: req.session.loggedIn,
        });
    } catch (err){
        res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try{
        const deletePost = await Post.destroy({
            where: {
                id:  req.params.id
              },
        })
        res.status(200).json(deletePost);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try{
        const updatePost = await Post.update({ 
            content: req.body.postContent,
        },
        {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json(updatePost);
    } catch (err) {
        res.status(400).json(err);
    }
});
module.exports = router;