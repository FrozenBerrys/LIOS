const express = require('express');
const router = express.Router();
const User = require('../models/Account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const BorrowHistory = require('../models/BorrowHistory');


const userLayout = '../views/layouts/user';
const loginLayout = '../views/layouts/login';


const borrowedItems = [
    {
        item_id: "64f8e8f1e4b0d1a2b3c4d5e6",
        title: "Microscope",
        quantity_borrowed: 2,
        borrowed_at: new Date("2023-09-07"),
    },
    {
        item_id: "64f8e8f1e4b0d1a2b3c4d5e7",
        title: "Bunsen Burner",
        quantity_borrowed: 1,
        borrowed_at: new Date("2023-09-08"),
    },
];



const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
  
    if (!token) {
        res.locals.isAuthenticated = false;
        return next();
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch(error) {
      res.status(401).json( { message: 'Unauthorized'} );
    }
  }
  

//isAuthenticated

router.get('/login', async (req,res)=>{
    try {
        const locals = {
            title: "login",
        }
        res.render("login", { 
            locals, 
            layout : loginLayout,
            isAuthenticated: req.cookies.token ? true : false
        });
    } catch (error) {
        console.log(error);
    }
});

/*POSTLOGIN*/
router.post('/register', async (req,res)=>{
    try {
        const locals = {
            title: "register",
        }

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
        res.render("login", { 
            locals, 
            layout : loginLayout,
            isAuthenticated: req.cookies.token ? true : false});

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

router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "dashboard",
        }

        const userId = req.userId; // Assuming you have the user ID from the JWT or session

        // Fetch borrowed items for the current user
        const borrowedItems = await BorrowHistory.find({
            user_id: userId,
            returned_at: null, // Only include items that haven't been returned
        }).populate("item_id"); // Populate the item details

        // Format the data for the EJS template
        const formattedBorrowedItems = borrowedItems.map((entry) => ({
            item_id: entry.item_id._id,
            title: entry.item_id.title,
            quantity_borrowed: entry.quantity_borrowed,
            borrowed_at: entry.borrowed_at,
        }));

        res.render("dashboard", { 
            borrowedItems: formattedBorrowedItems,
            locals, 
            layout : userLayout,
            isAuthenticated: req.cookies.token ? true : false
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching borrowed items.");
    }
});


router.post("/return/:id", async (req, res) => {
    try {
        const locals = {
        }

        const itemId = req.params.itemId;
        const userId = req.userId; // Assuming you have the user ID from the JWT or session

        const borrowEntry = await BorrowHistory.findOne({
            item_id: itemId,
            user_id: userId,
            returned_at: null, // Only return items that haven't been returned yet
        });

        if (!borrowEntry) {
            return res.status(404).send("Item not found or already returned.");
        }

        // Mark the item as returned
        borrowEntry.returned_at = new Date();
        await borrowEntry.save();

        // Increase the item's quantity
        const item = await Item.findById(itemId);
        item.quantity += borrowEntry.quantity_borrowed;
        await item.save();

        res.redirect("/dashboard"); // Redirect back to the dashboard
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while returning the item.");
    }
});






router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the JWT cookie
    res.redirect('/'); // Redirect to the home page
});

module.exports = router;