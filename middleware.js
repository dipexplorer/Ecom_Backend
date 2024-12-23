const Product = require("./models/products.js");
const { productSchema } = require("./schema.js");
const expressError = require("./utils/expressError.js");

module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        //save current URL
        req.session.redirectUrl = req.originalUrl;
        // console.log(req.originalUrlUrl);
        req.flash("error", "You must be logged in to access this page");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//ISADMIN
module.exports.isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        next();
    } else {
        req.flash("error", "You must be an admin to access this page");
        res.redirect("/products");
    }
};

module.exports.validateProduct=(req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(errMsg, 400);
    }
    next();
};