const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


module.exports = {
  // Get all students
  getUsers(req, res) {
    User.find()
      .then((userdata) => {
        return res.json(userdata);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('thoughts')
      .populate('friends')
      .then((userdata) =>
        !userdata
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(userdata)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new student
  createUser(req, res) {
    User.create(req.body)
      .then((userdata) => res.json(userdata))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a student and remove them from the course
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((userdata) =>
        !userdata
          ? res.status(404).json({ message: 'No such userdata exists' })
          : res.json(userdata)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $set: req.body,
      },
      {
        runValidators: true, new: true,
      }
    )
      .then((userdata) => {
        if (!userdata) {
          return res.status(404).json({ message: 'No userdata with this id!' });
        }
        res.json(userdata);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((userdata) =>
        !userdata
          ? res
              .status(404)
              .json({ message: 'No userdata found with that ID :(' })
          : res.json(userdata)
      )
      .catch((err) => res.status(500).json(err));
  },
  
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.studentId },
      { $pull: { friends: req.params.friendId  } },
      { runValidators: true, new: true }
    )
      .then((userdata) =>
        !userdata
          ? res
              .status(404)
              .json({ message: 'No userdata found with that ID :(' })
          : res.json(userdata)
      )
      .catch((err) => res.status(500).json(err));
  },
};