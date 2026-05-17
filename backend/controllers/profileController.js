const AdminProfile = require('../models/AdminProfile');

const getProfile = async (req, res) => {
  try {
    let profile = await AdminProfile.findOne();
    if (!profile) {
      profile = await AdminProfile.create({
        username: req.admin.username,
        name: req.admin.username,
        email: '',
        profilePicture: '',
      });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    let profile = await AdminProfile.findOne();
    if (!profile) {
      profile = new AdminProfile({ username: req.admin.username });
    }
    const { name, email, profilePicture } = req.body;
    if (name !== undefined) profile.name = name;
    if (email !== undefined) profile.email = email;
    if (profilePicture !== undefined) profile.profilePicture = profilePicture;
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile };
