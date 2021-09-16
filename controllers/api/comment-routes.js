const router = require('express').Router();
const { Comment, Post, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            content: req.body.comment,
            poster_id: req.body.urlId,
            date: new Date().toString(),
            user_id: req.session.user_id
        });
        res.status(200).json(newComment);

    } catch (err) {
        res.status(400).json(err);
    }
});
module.exports = router;