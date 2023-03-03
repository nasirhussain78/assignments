import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


class UserController {
    //1✅Category
    async createCategory(req, res) {
        try {

            const data = req.body;

            if (!isValidRequestBody(data)) {
                return res.status(400).send({ status: false, message: 'Please provide details' })
            }

            if (!isValid(data.name)) {
                return res.status(400).send({ status: false, message: 'name is required' })
            }

            const result = await CategoryModel.create(data);
            return res.status(200).send({ status: true, msg: "successfully created", data: result });

        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }

    //get category
    async getCategory(req, res) {
        try {
            const result = await CategoryModel.find({ isDeleted: false });
            return res.status(200).send({ status: true, msg: "successfully", data: result });
        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }

    // get by id
    async getCategoryById(req, res) {
        try {
            const id = req.query.id;
            if (!(/^[0-9a-fA-F]{24}$/.test(id))) {
                return res.status(400).send({ status: false, message: 'please provide valid category id' })
            }
            const result = await CategoryModel.findOne({ _id: id, isDeleted: false });
            if (!(result)) {
                return res.status(200).send({ status: false, msg: "no data found by this id" });
            }

            return res.status(200).send({ status: true, msg: "successfully", data: result });
        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    //update category
    async updateCategory(req, res) {
        try {
            const document = req.body;
            const id = await req.params.id;
            const category = await CategoryModel.findOne({ _id: id, isDeleted: false })
            if (!(category)) {
                res.status(404).send({ status: false, message: "No data found" })
                return
            }
            const result = await CategoryModel.findOneAndUpdate({ _id: id }, { $set: document }, { new: true });
            return res.status(200).send({ status: true, msg: "successfully upadate", data: result });

        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    //delete category
    async deleteCategory(req, res) {
        try {
            const id = req.query.id
            const category = await CategoryModel.findOne({ _id: id })

            if (!category) {
                return res.status(404).send({ status: false, message: ' not found' })
            }

            if (category.isDeleted == true) {
                res.status(400).send({ status: false, message: "category is already deleted" })
                return
            }
            const result = await CategoryModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true })

            return res.status(200).send({ status: true, msg: "successfully deleted", data: result });

        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }
    

    //2️✅Product
    async createProduct(req, res) {
        try {
            const data = req.body;
            const { name, description, categoryId } = data;

            if (!isValidRequestBody(data)) {
                return res.status(400).send({ status: false, message: 'Please provide details' })
            }
            if (!isValid(name)) {
                return res.status(400).send({ status: false, message: 'name is required' })
            }
            if (!isValid(description)) {
                return res.status(400).send({ status: false, message: 'description is required' })
            }
            if (!isValid(categoryId)) {
                return res.status(400).send({ status: false, message: 'categoryId is required' })
            }

            const result = await ProductModel.create(data);

            return res.status(200).send({ status: true, msg: "successfully created", data : result});

        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }

       
    //Pagination & and get products
    async getProduct(req, res) {
        try {
            let pageSize = req.query.pageSize;
            let currentPage = req.query.currentPage || 1;

            const result = await ProductModel.find({isDeleted:false})
                .populate('category', 'name')
                .limit(pageSize)
                .skip((currentPage - 1) * pageSize);
            let total = await ProductModel.find({isDeleted:false}).countDocuments()
            let totalPage = Math.ceil(total / pageSize);

            return res.status(200).send({ status: true, msg: "successfull", data: result, count: total, page: totalPage });
        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    //update product
    async updateProduct(req, res) {
        try {
            const document = req.body;
            const id = await req.params.id;
            const product = await ProductModel.findOne({ _id: id, isDeleted: false })
            if (!(product)) {
                res.status(404).send({ status: false, message: "No data found" })
                return
            }
            const result = await ProductModel.findOneAndUpdate({ _id: id }, { $set: document }, { new: true });
            return res.status(200).send({ status: true, msg: "successfully upadate", data: result });
        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    //delete product
    async deleteProduct(req, res) {
        try {
            
            const id = req.query.id
            const product = await ProductModel.findOne({ _id: id, isDeleted:false })

            if (!product) {
                return res.status(404).send({ status: false, message: 'not found' })
            }

            const result = await ProductModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true })

            return res.status(200).send({ status: true, msg: "successfully deleted", data: result });

        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }
}

export default new UserController()

