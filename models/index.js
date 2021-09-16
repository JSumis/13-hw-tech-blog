const User = require('./User';)
const Comment = require('./Comment';)
const Post = require('./Post';)

Post.belongsTo(User, { foreignKey: "user_id"});
Comment.belongsTo(User);
Post.hasMany(Comment);





module.exports = { User, Comment, Post };