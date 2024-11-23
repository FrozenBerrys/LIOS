const express = require('express');
const router = express.Router();
const User = require('../models/Account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;


const userLayout = '../views/layouts/user';
const loginLayout = '../views/layouts/login';


const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
  
    if(!token) {
      return res.status(401).json( { message: 'Unauthorized'} );
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch(error) {
      res.status(401).json( { message: 'Unauthorized'} );
    }
  }
  


router.get('/login', async (req,res)=>{
    try {
        const locals = {
            title: "login",
        }
        res.render("login", { locals, layout : loginLayout});
    } catch (error) {
        console.log(error);
    }
});

/*POSTLOGIN*/
router.post('/register', async (req,res)=>{
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({username, password: hashedPassword});
            res.status(201).json({message: "User created", user});
        } catch(error){
            if(error.code === 11000){ // SEARCH DB FOR VALID TEACHER EMAILS
                res.status(409).json({message: "User already in use"});
            }
            
            res.status(500).json({message:"Internal server error"}); 
        } 
        res.render("login", { locals, layout : loginLayout});
    } catch (error) {
        console.log(error);
    }
});

/* POST LOGIN*/
router.post('/login', async (req,res)=>{
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne( {username} );

        if(!user){
            //return res.status(401).json( { message: 'Invalid Credentials'} );
            res.redirect('/login');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            //return res.status(401).json( { message: 'Invalid Credentials'} );
            res.redirect('/login');
        }

        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token', token,  {httpOnly : true} );

        res.redirect('/dashboard')

    } catch (error) {
        console.log(error);
    }
});

router.get('/dashboard', authMiddleware, async (req,res)=>{
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Welcome, Master',
        }
        res.render('user/dashboard', {locals, layout : userLayout});
    } catch (error) {
        
    }
});



module.exports = router;