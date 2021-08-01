const express = require('express');
const { userValidation } = require('../validations/auth');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const router = express.Router();

router.post('/create', async (req, res) => {
    const { error } = userValidation(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
        return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
    });
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
   
});


router.patch('/update/:id', getUser, async (req, res)=> {
    const { error } = userValidation(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });

    if (req.body.name != null) {
		req.user.name = req.body.name;
	}
    if (req.body.phone != null) {
		req.user.phone = req.body.phone;
	}
    if (req.body.email != null) {
		req.user.email = req.body.email;
	}
    if (req.body.password != null) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
		req.user.password = hashedPassword;
	}



	try {
		const updatedUser = await req.user.save();
		res.json(updatedUser);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}

});

async function getUser(req,res,next){
    let user;
    try {
		user = await User.findById(req.params.id);
		if (user == null) {
			return res.status(404).json({ message: 'Cannot find user' });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}

	req.user = user;

    next();
}


module.exports = router;