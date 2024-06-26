import { errorHandler } from "../middleware/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
        username
        , email,
        password: hashedPassword,
        socialLinks: {
            github: "", // Agrega los enlaces sociales vacíos al registrar con Google
            instagram: "",
            linkedin: ""
        }
    });
    try {
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
};


export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {

        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(401, "Invalid Credentials!"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Invalid Password!"));
        }

        const token = jwt.sign(
            { id: validUser._id },
            process.env.JWT_SECRET

        );
        const expiryDate = new Date(Date.now() + 3600000);
        const { password: hashedPassword, ...rest } = validUser._doc;
        res
            .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json(rest);


    } catch (error) {

        next(error);
    }


};

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(36).slice(-8),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
                socialLinks: {
                    github: "", // Agrega los enlaces sociales vacíos al registrar con Google
                    instagram: "",
                    linkedin: ""
                }
            });

            await newUser.save();

            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);

            //Creamos el token para que la password sea una cookie
            const { password: pass, ...rest } = newUser._doc;

            res.status(200)
                .cookie('access_token', token, {
                    httpOnly: true
                }).json(rest)
        }
    } catch (error) {
        next(error)
    }
};

export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('Signout success!');
    } catch (error) {
        next(error);
    }
};

