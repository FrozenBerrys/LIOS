const express = require('express');
const router = express.Router();

//Routes
router.get('', (req,res)=>{
    const locals = {
        title: "Hobby School Lab",
    } // sending locals. as data to dynamically load into the layout 
    res.render("index", { locals });
})

router.get('/biology', async (req,res)=>{
    try {
        const locals = {
            title: "biology",
        }
        res.render("biology", { locals });
    } catch (error) {
        console.log("Error");
    }
});

router.get('/chemistry', async (req,res)=>{
    try {
        const locals = {
            title: "chemistry",
        }
        res.render("chemistry", { locals });
    } catch (error) {
        console.log("Error");
    }
});

router.get('/robotics', async (req,res)=>{
    try {
        const locals = {
            title: "robotics",
        }
        res.render("robotics", { locals });
    } catch (error) {
        console.log("Error");
    }
});

router.get('/physics', async (req,res)=>{
    try {
        const locals = {
            title: "physics",
        }
        res.render("physics", { locals });
    } catch (error) {
        console.log("Error");
    }
});




module.exports = router;