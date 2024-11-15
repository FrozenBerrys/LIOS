const express = require('express');
const router = express.Router();

const userLayout = '../views/layouts/user';
const loginLayout = '../views/layouts/login';

router.get('/login', async (req,res)=>{
    try {
        const locals = {
            title: "login",
        }
        res.render("user/login", { locals, layout : loginLayout});
    } catch (error) {
        console.log("Error");
    }
});


module.exports = router;