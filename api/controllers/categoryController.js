const Category = require("../models/CategoryModel")

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: "asc" }).orFail();
        res.json(categories);
    } catch (error) {
        next(error)
    }
}

/**
 *  two exclamation marks
    !! 0 –> false
    !! null –> false
    !! undefined –> false
    !! 48 –> true
    !! “hello” –> true
    !! [1, 2, 3] –> true
 */
const newCategory = async (req, res, next) => {
    try {
        const { category } = req.body;
        if (!category) {
            res.status(400).send("Category input is required");
        }

        const categoryExists = await Category.findOne({ name: category })
        if (categoryExists) {
            res.status(400).send("Category already exists");
        } else {
            const categoryCreated = await Category.create({ name: category })
            res.status(201).send({ categoryCreated})
        }

        res.send(category)
    } catch (error) {
        next(error)
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        if (req.params.category !== "Choose category") {
            console.log(req.params.category);
            const categoryExists = await Category.findOne({
                name: decodeURIComponent(req.params.category)
            }).orFail();
            await categoryExists.deleteOne();
            res.json({ isCategoryDeleted: true, deletedCategory:req.params.category })
        }
    } catch (error) {
        next(error);
    }
}

const saveAttr = async (req, res, next) => {
    const { key, val, categoryChoosen } = req.body;
    if (!key || !val || !categoryChoosen) {
        return res.status(400).send("All inputs are required")
    }

    try {
        const category = categoryChoosen.split("/")[0]
        const categoryExists = await Category.findOne({ name: category });
        console.log(categoryExists);
        if (categoryExists?.attrs.length > 0) {
            //! if key exits in the database then add a value to the key 
            var isKeyExistsInDatabase = false;
            categoryExists.attrs.map((item,idx)=>{
                if (item.key === key) {
                    isKeyExistsInDatabase = true;
                    var copyAtributeValues= [...categoryExists.attrs[idx].value]
                    copyAtributeValues.push(val);
                    var newAttributeValues = [... new Set(copyAtributeValues)] // Set ensures unique values
                    categoryExists.attrs[idx].value = newAttributeValues;
                }
            })

            if (!isKeyExistsInDatabase) {
                categoryExists.attrs.push({ key: key, value: [val] });
            }
            await categoryExists.save();
        }else {
            if(!categoryExists){
                const categoryCreated = await Category.create({ name: category })
                categoryCreated.attrs.push({ key: key, value: [val] });
                categoryCreated.save();
            }else{
                // push the array 
                categoryExists.attrs.push({ key: key, value: [val] });
                await categoryExists.save();
            }
        } 
        let cat = await Category.find().sort({name:"asc"});
        return res.status(200).json({categoryUpdated: cat});
    } catch (error) {
        next(error);
    }
}




module.exports = { getCategories, newCategory, deleteCategory , saveAttr};