const User = require('../models/User')
const Profile = require('../models/Profile')
const fs = require('fs')

const uploadProfilePics = async (req, res) => {
    if (req.file) {
        try {
            let oldProfilePics = req.user.profilePics
            let profile = await Profile.findOne({ user: req.user._id });

            let profilePics = `/uploads/${req.file.filename}`

            if (profile) {
                await Profile.findOneAndUpdate({
                    user: req.user._id
                }, {
                    $set: { profilePics }
                })
            }

            await User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $set: { profilePics }
                })

                if(oldProfilePics !== '/uploads/default.png') {
                    fs.unlink(`public${oldProfilePics}`, err =>{
                        if(err) {
                            console.log(err);
                        }
                    })
                }

            res.status(200).json({
                profilePics
            })

        } catch (error) {
            return res.status(500).json({
                profilePics: req.user.profilePics

                // '/uploads/default.png'
            })
        }
    }
    else {
        res.status(500).json({
            profilePics: req.user.profilePics
        })
    }

}

const removeProfilePics = (req, res, next) => {

    try {
        let defaultProfile = '/uploads/default.png';
        let currentpProfilePics = req.user.profilePics

        fs.unlink(`public${currentpProfilePics}`, async (err) => {

            let profile = await Profile.findOne({ user: req.user._id });

            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePics: defaultProfile } }
                )
            }

            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { profilePics: defaultProfile } }
            )

        })

        res.status(200).json({
            profilePics: defaultProfile
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Can not Remove Profile Pics'
        })
    }

}

const postImageUploadController = (req, res, next) => {
    try {
        if (req.file) {
            return res.status(200).json({
                imgUrl: `/uploads/${req.file.filename}`
            });
        }
        return res.status(500).json({
            message: 'File upload failed'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    uploadProfilePics,
    removeProfilePics,
    postImageUploadController
}