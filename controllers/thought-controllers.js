const { User, Thought } = require('../models');

module.exports = {
  // Get all courses
  getThoughts(req, res) {
    Thought.find()
      .then((thoughtdata) => res.json(thoughtdata))
      .catch((err) => res.status(500).json(err));
  },
  // Get a course
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thoughtdata) =>
        !thoughtdata
          ? res.status(404).json({ message: 'No thoughtdata with that ID' })
          : res.json(thoughtdata)
      )
      .catch((err) => res.status(500).json(err));
  },
 
  createThought(req, res) {
    Thought.create(req.body)
    .then((thoughtdata) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thoughtdata._id } },
        { new: true }
      );
    })
    .then((userdata) => {
      if (!userdata) {
        return res.status(404).json({ message: 'no userdata with this id' });
      }

      res.json({ message: 'Thought successfully created!' });
    })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Update a course
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  addReaction(req,res){

  },
  removeReaction(req,res){

  }
};