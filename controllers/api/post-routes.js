const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth')

router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            title: req.body.title,
            text: req.body.text,
            date: new Date().toString(),
            user_id: req.session.user_id

        });
        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});
module.export = router;