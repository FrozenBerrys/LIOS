const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

//Routes
router.get('', async (req,res)=>{
    try{
        const locals = {
            title: "Hobby School Lab",
        } // sending locals. as data to dynamically load into the layout 
    
        let perPage = 16;
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
            prevPage: hasPrevPage ? prevPage : null,
            isAuthenticated: req.cookies.token ? true : false
        });
    } catch(error){
        console.log(error);
    }
})


//GET ITEM
router.get('/item/:id', async (req,res)=>{
    try{
        let slug = req.params.id;
        const data = await Item.findById({_id: slug});

        const locals = {
            title: data.title,
        } // sending locals. as data to dynamically load into the layout 
    
        
        res.render("item", { 
            locals, 
            data,
            isAuthenticated: req.cookies.token ? true : false
        });
    } catch(error){
        console.log(error);
    }
})
/*POST*/
router.post('/search', async (req,res)=>{
    try {
        const locals = {
            title: "search",
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9\s]/g, "");


        const data = await Item.find({
            $or: [
                {title: { $regex: new RegExp(searchNoSpecialChar, "i")} },
                {subject: { $regex: new RegExp(searchNoSpecialChar, "i")} }
            ]
        })

        res.render("search", { 
            data,
            locals, 
            searchNoSpecialChar,
            isAuthenticated: req.cookies.token ? true : false });

    } catch (error) {
        console.log(error);
    }
});






// function insertItemData (){
//     Item.insertMany([
//         {
//             title: "my dreams",
//             quantity: 42,
//             subject: "Biology",
//             image: "https://i.postimg.cc/ZYBSd0MX/women.jpg"
//         },
//     ])
// }
// insertItemData();


module.exports = router;

