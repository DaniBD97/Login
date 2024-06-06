
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../middleware/error.js'
import User from '../models/user.model.js';
// import nodemailer from 'nodemailer'

// const validateURL = (url) => {
//   const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
//   return urlPattern.test(url);
// };


export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must be between 7 and 20 characters')
      );
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
  }

  try {
    // Validación de enlaces sociales
    const { socialLinks } = req.body;

    for (const key in socialLinks) {
      if (socialLinks.hasOwnProperty(key)) {
        const link = socialLinks[key];
        if (!link.match(/^(ftp|http|https):\/\/[^ "]+$/)) {
          return next(
            errorHandler(400, `Invalid ${key} URL`)
          );
        }
      }
    }

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateFields = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      profilePicture: req.body.profilePicture,
      // Actualiza solo los enlaces sociales proporcionados
      'socialLinks.github': req.body.socialLinks?.github,
      'socialLinks.instagram': req.body.socialLinks?.instagram,
      'socialLinks.linkedin': req.body.socialLinks?.linkedin,
    };

    // Elimina campos no proporcionados para no sobrescribir con `undefined`
    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};





export const updatePassword = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  try {
    const updatedPass = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {

          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedPass._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }

}


export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const { password, ...rest } = user._doc;


    res.status(200).json(rest);


  } catch (error) {
    next(error)
  }
}



export const forgotPassword = async (req, res, next) => {

  const { email } = req.body;
  // const nodemailer = require('nodemailer');


  if (!email || email === '') {
    return next(errorHandler(400, 'All fields are Required'));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, 'User Not Found'));
    }

    // const token = jwt.sign(
    //   {
    //     id: validUser._id
    //   },
    //   'your_secret_key' // Coloca tu clave secreta aquí
    // );


    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'testdevops97@gmail.com',
        pass: 'xijt rexa jibb hqov' // No es recomendable poner la contraseña directamente aquí
      }
    });

    var mailOptions = {
      from: 'youremail@gmail.com',
      to: validUser.email, // Usamos el email del usuario encontrado en la base de datos
      subject: 'Reset Password Link',
      text: `http://localhost:5173/reset_password/${validUser._id}` // Usamos validUser._id
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return next(error); // Manejamos el error llamando a next con el error
      } else {
        return res.send({ Status: "Success" }); // Enviamos la respuesta de éxito fuera de la función de callback
      }
    });

  } catch (error) {
    next(error);
  }
};