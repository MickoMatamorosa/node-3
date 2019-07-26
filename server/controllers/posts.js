function create(req, res){
    const db = req.app.get('db')
    
    const { userId, content } = req.body
    
    db.posts
      .save({ userId, content })
      .then(post => res.status(201).json(post)) // returns a promise so we need to use .then
      .catch(err => {
        console.error(err); // if something happens we handle the error as well.
        res.status(500).end();
      });
}

function getPost(req, res){
    const db = req.app.get('db')
    const postId = req.params.postId
    const id = parseInt(postId)
    
    db.posts
      .find({id})
      .then(post => res.status(200).json(post))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
}

function getUserPosts(req, res){
    const db = req.app.get('db')
    const userId = req.params.userId
    const id = parseInt(userId)

    db.posts
      .find({ "userId": id })
      .then(post => res.status(200).json(post))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
}

function editPost(req, res){
    const db = req.app.get('db');
    const { content } = req.body;

    const id = parseInt(req.params.postId)

    db.posts
      .update({ "id": id }, { "content": content })
      .then(post => res.status(200).json(post))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
}

module.exports = {
    create,
    getPost,
    getUserPosts,
    editPost,
};