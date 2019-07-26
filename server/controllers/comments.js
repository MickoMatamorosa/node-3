function create(req, res){
    const db = req.app.get('db')
    
    const { userId, postId, comment } = req.body
    
    db.comments
      .save({ userId, postId, comment })
      .then(comments => res.status(201).json(comments)) // returns a promise so we need to use .then
      .catch(err => {
        console.error(err); // if something happens we handle the error as well.
        res.status(500).end();
      });
}

function editComment(req, res){
  const db = req.app.get('db');
  const { comment } = req.body;

  const id = parseInt(req.params.cmtId)

  db.comments
    .update({ "id": id }, { "comment": comment })
    .then(comment => res.status(200).json(comment))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}

module.exports = {
    create,
    editComment,
};