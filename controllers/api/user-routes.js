const router = require('express').Router();
const { User } = require('../../models');

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

router.post('/signup', async (req, res) => {
    try{
        const newLogin = await User.create(req.body);
        req.session.save(() => {
            req.session.user_id = newLogin.id;
            req.session.loggedIn = true;
            res.json(newLogin);
            
        });
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/signin', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { username: req.body.email }, });
        if (!userData) {
            res.status(400).json({ message: "Incorrect email or password.  Please try again" });
            return;
        }
        const validPassword = await userData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: "Incorrect email or password.  Please try again" });
            return;
        }
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.loggedIn = true;
            res.json({ user: userData, message: "You are now logged in" });
        });
    } catch (err) {
        res.status(400).json(err)
    }
});
 

module.exports = router;
