//Initialize libraries
var express = require("express");


module.exports = function (passport) {
    //Router
    var router = express.Router();
    //Load Modules
    var SesssionController = require('../../modules/Session');


    /**
    **@route POST policyconfig/new
    **@desc fetch list of policy configs
    **@access Public
    **/

    router.post("/", (req, res) => {

        SesssionController.Adminlogin(req.body).then((result) => {
            console.log("res", result);

            return res.status(200).json({
                message: "Successfully Authenticated",
                data: result
            });

        }).catch((e) => {
            console.log(e);
            return res.status(400).json({ e }); //Return Error
        });
    });


    /**
**@route POST policyconfig/new
**@desc fetch list of policy configs
**@access Public
**/

    router.post("/logout",
        passport.authenticate('jwt', { session: false }),
        (req, res) => {

            SesssionController.logout(req).then((result) => {
                console.log("res", result);

                return res.status(200).json({
                    message: "Successfully Logged out",
                    data: result
                });

            }).catch((e) => {
                console.log(e);
                return res.status(400).json({ e }); //Return Error
            });
        });


    /**
**@route POST policyconfig/new
**@desc fetch list of policy configs
**@access Public
**/

    router.post("/register", (req, res) => {

        SesssionController.AdminSignUp(req.body).then((result) => {
            console.log("res", result);

            return res.status(200).json({
                message: "Successfully Authenticated",
                data: result
            });

        }).catch((e) => {
            console.log(e);
            return res.status(400).json({ e }); //Return Error
        });
    });

    return router;

}