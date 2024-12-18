import Usuario from '../models/User'
import jwt from 'jsonwebtoken'
import config from '../config'
import Rol from '../models/Rol';
import { json } from 'express';

export const obtenerFrmUsuario = async (req, res) => {
    res.render('users/signup');
}
export const obtenerFrmUsuIni = async (req, res) => {
    res.render('users/signin');
}

export const signUp = async (req, res) => {
    try {
        // obtenemos datos del formulario
        const { cedula, nombre, apellido, correo, contrasenia, roles } = req.body;
        //Verificar si el usuario existe

        const newUser = new Usuario({
            cedula,
            nombre,
            apellido,
            correo,
            contrasenia: await Usuario.encryptPassword(contrasenia)
        })

        // verificamos roles
        if (req.body.roles) {
            const foundRol = await Rol.find({ nombre: { $in: roles } });
            newUser.roles = foundRol.map((rol) => rol._id);
        } else {
            const rol = await Rol.findOne({ nombre: "Cliente" });
            newUser.roles = [rol._id];
        }

        // guardamos en mongo
        const savedUser = await newUser.save();
        console.log(savedUser)

        // Creamos un token
        const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
            expiresIn: 86400, // 24 hours
        });
        //test
        return res.status(200).json({ token });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

export const signIn = async (req, res) => {
    try {
        // validar  correo electrónico 
        const userFound = await Usuario.findOne({ correo: req.body.correo }).populate("roles");

        if (!userFound) return res.status(400).json({ message: "User Not Found" });

        const matchPassword = await Usuario.comparePassword(
            req.body.contrasenia,
            userFound.contrasenia 
        );

        if (!matchPassword)
            return res.status(401).json({
                token: null,
                message: "Invalid Password",
            });

        const token = jwt.sign({ id: userFound._id }, config.SECRET, {
            expiresIn: 86400, // 24 hours
        });
        //test
        // res.json({ token });
        res.redirect('/frm_inicioUsuario/add')
    } catch (error) {
        console.log(error);
    }
};