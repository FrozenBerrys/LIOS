const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

//Routes
router.get('', async (req,res)=>{
    try{
        const locals = {
            title: "Hobby School Lab",
        } // sending locals. as data to dynamically load into the layout 
    
        let perPage = 8;
        let page = req.query.page || 1; //set default page query to 1

        const data = await Item.aggregate([{ $sort: { title: 1 }}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Item.countDocuments();
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);
        const hasPrevPage = prevPage > 0;

        res.render("index", { 
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            prevPage: hasPrevPage ? prevPage : null
        });
    } catch(error){
        console.log(error);
    }
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







function insertItemData (){
    Item.insertMany([
        {
            title: "Scalpel",
            borrowed: false,
            subject: "Biology",
            image: "https://i.postimg.cc/QtdbNL8b/scalpel.jpg"
        },
    ])
}
//insertItemData();


module.exports = router;

