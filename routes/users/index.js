//Initialize libraries
var express = require("express");
const verifyToken = require("../../verifyToken/index");

var multer = require("multer");

//Initialize config
var keys = require("../../config/keys");

var storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
});

var uploadSingle = multer({ storage: storage }).single('file');



module.exports = function (passport) {
    //Router

    var router = express.Router();
    // router.use('*',verifyToken);

    // Load User model
    // var User = require("../../models/User");

    //Load Modules
    var UserController = require('../../modules/user');

    // Validations
   

    /**
     * Deprecated (v0)
    **@route POST api/users/tpa/register
    **@desc Register TPA
    **@access Private
    **
    **/

    router.post("/register", (req, res) => {

        var { errors, isValid } = validateRegisterInput(req.body); //ValidateInput

        // Check validation
        if (!isValid) {
            return res.status(400).json({ errors });
        }

        /* Convert case of email */

        UserController.AdminSignUp(req.body).then((result) => {
            console.log("res", result);

            return res.status(200).json({
                message: "Account successfully created",
                data: result
            }); //Return User

        }).catch((e) => {
            console.log(e);
            return res.status(400).json({ e }); //Return Error
        });

    });

    /**
     * Deprecated (v0)
    **@route POST api/users/tpa/login
    **@desc Login TPA
    **@access Private
    **
    **/

    router.post("/login", (req, res) => {

        var { errors, isValid } = validateRegisterInput(req.body); //ValidateInput

        // Check validation
        if (!isValid) {
            return res.status(400).json({ errors });
        }

        /* Convert case of email */

        UserController.Adminlogin(req.body).then((result) => {
            console.log("res", result);

            return res.status(200).json({
                message: "user logged in successfully",
                data: result
            }); //Return User

        }).catch((e) => {
            console.log(e);
            return res.status(400).json({ e }); //Return Error
        });

    });


    // @route POST api/users/login
    // @desc Login user and return JWT token
    // @access Public
    router.post("/otp/verification", (req, res) => {

        //Do validations here

        UserController.verifyOtp(req.body).then((result) => {

            console.log("Otp verification", result);

            return res.status(200).json({
                message: "OTP verified successfully",
                data: result
            });

        }).catch((e) => {
            return res.status(400).json({ e });
        });

    });


    // @route POST api/users/login
    // @desc Login user and return JWT token
    // @access Public
    router.post("/otp/renewal", (req, res) => {

        //Do validations here

        UserController.resendOtp(req.body).then((result) => {

            console.log("Otp resend", result);

            return res.status(200).json({
                message: "OTP resent successfully",
                data: result
            });

        }).catch((e) => {
            return res.status(400).json({ e });
        });

    });

    // @route POST api/users/login
    // @desc Login user and return JWT token
    // @access Public
    router.post("/legal", (req, res) => {

        //Do validations here

        UserController.acceptLegal(req.body).then((result) => {

            console.log("Accept Legal", result);

            return res.status(200).json({
                message: "Update Accept Legal successfully",
                data: result
            });

        }).catch((e) => {
            return res.status(400).json({ e });
        });

    });

    // @route POST api/users/login
    // @desc Login user and return JWT token
    // @access Public
    // router.post("/pp", (req, res) => {

    //     //Do validations here

    //     UserController.acceptTos(req.body).then((result) => {

    //         console.log("Accept Tos", result);

    //         return res.status(200).json({
    //             message: "Update Accept TOS successfully",
    //             data: result
    //         });

    //     }).catch((e) => {
    //         return res.status(400).json({ e });
    //     });

    // });

    // @route POST api/users/login
    // @desc Login user and return JWT token
    // @access Public
    // router.post("/accept-pp", (req, res) => {

    //     //Do validations here

    //     UserController.acceptPp(req.body).then((result) => {

    //         console.log("Accept Pp", result);

    //         return res.status(200).json({
    //             message: "Update Accept PP successfully",
    //             data: result
    //         });

    //     }).catch((e) => {
    //         return res.status(400).json({ e });
    //     });

    // });

    // @route POST api/users/login
    // @desc Login user and return JWT token
    // @access Public
    router.post("/", (req, res) => {


        console.log("Login request", req.body);

        var { errors, isValid } = validateLoginInput(req.body);  // Form validation

        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        UserController.login(req.body).then((result) => {
            console.log("User Login result", result);

            return res.status(200).json({
                message: "Login successful",
                data: result
            });
        }).catch((e) => {

            return res.status(400).json({ e });
        });


    });

    // @route POST api/users/login
    // @desc Login user and return JWT token
    // @access Public
    router.post("/user-type", (req, res) => {

        console.log("User Type request", req.body);

        UserController.userType(req.body).then((result) => {
            console.log("User Type result", result);

            return res.status(200).json({
                message: "User Type successful",
                data: result
            });
        }).catch((e) => {

            return res.status(400).json({ e });
        });


    });

    // @route POST api/users/login
    // @desc Login user and return JWT token
    // @access Public
    router.post("/video", (req, res) => {

        console.log("Video request", req.body);

        UserController.video(req.body).then((result) => {
            console.log("Video result", result);

            return res.status(200).json({
                message: "Video successful",
                data: result
            });
        }).catch((e) => {

            return res.status(400).json({ e });
        });


    });


    /**
     **@route POST scid/uploadImage
    **@desc Register Establishment
    **@access Public
    **/

    router.post("/:scid/image", uploadSingle, (req, res) => {
        const scid = req.params.scid;
        const file = req.file;
        console.log(scid, file);
        // let data= {
        //     scid: scid,
        //     file: file
        // }
        // res.send(data)

        UserController.uploadImage(file, scid).then((result) => {
            console.log("res", result);

            return res.status(200).json({
                message: "Image successfully uploaded",
                data: result
            }); //Return User

        }).catch((e) => {
            console.log(e);
            return res.status(400).json({ e }); //Return Error
        });


    });



    router.post("/logout", (req, res) => {

        var logout = req.logout();

        if (logout) {

            return res.json({
                status: 200,
            });

        } else {
            return res.json({
                status: 400
            });
        }

    });

    // list of all the clients
    router.get("/clients/list", passport.authenticate('jwt', { session: false }), (req, res) => {

        console.log("list request", req.body);

        UserController.fetchClientData().then((result) => {
            console.log("result", result);

            return res.status(200).json({
                message: "details fetched successfully",
                data: result
            });
        }).catch((e) => {

            return res.status(400).json({ e });
        });


    });


    //fetching client specific data
    router.post("/clients/data", passport.authenticate('jwt', { session: false }), (req, res) => {

        // console.log("list request", req.body);

        UserController.fetchClientDetails(req.body).then((result) => {
            console.log("result", result);

            return res.status(200).json({
                message: "details fetched successfully",
                data: result
            });
        }).catch((e) => {

            return res.status(400).json({ e });
        });


    });

    // store latest backup date of backup
    router.post("/client/backup/detail", passport.authenticate('jwt', { session: false }), (req, res) => {

        // console.log("list request", req.body);
        // console.log("list request", req)

        UserController.clientBackupStatus(req.body).then((result) => {
            console.log("result", result);

            return res.status(200).json({
                message: "Stored backup details successfully",
                data: result
            });
        }).catch((e) => {

            return res.status(400).json({ e });
        });


    });
    
    
    // for backup from server to local- encryption and decryption
    router.post("/client/backup/:id", (req, res) => {

        // console.log("list request", req.body);
        // console.log("list request", req)

        UserController.clientBackup(req.query,req.body).then((result) => {
            console.log("result", result);

            return res.status(200).json({
                message: "details fetched successfully",
                data: result
            });
        }).catch((e) => {

            return res.status(400).json({ e });
        });


    });



    // add status of purge
    // router.post("/client/purge/detail", passport.authenticate('jwt', { session: false }), (req, res) => {

    //     // console.log("list request", req.body);
    //     // console.log("list request", req)

    //     UserController.clientBackupStatus(req.body).then((result) => {
    //         console.log("result", result);

    //         return res.status(200).json({
    //             message: "Stored purge details successfully",
    //             data: result
    //         });
    //     }).catch((e) => {

    //         return res.status(400).json({ e });
    //     });


    // });


    //last backup data from local DB
    router.get("/backup/data", passport.authenticate('jwt', { session: false }), (req, res) => {

        // console.log("list request", req.body);
        // console.log("list request", req)
        let queryParams = req && req.query;       

        UserController.paginatedBackupDetail(queryParams).then((result) => {
            console.log("result", result);

            return res.status(200).json({
                message: "details fetched successfully",
                data: result
            });
        }).catch((e) => {

            return res.status(400).json({ e });
        });


    });

    //last purge data from local DB
    router.get("/purge/data", passport.authenticate('jwt', { session: false }), (req, res) => {

        // console.log("list request", req.body);
        // console.log("list request", req)
        let queryParams = req && req.query;       

        UserController.paginatedPurgeDetail(queryParams).then((result) => {
            console.log("result", result);

            return res.status(200).json({
                message: "details fetched successfully",
                data: result
            });
        }).catch((e) => {

            return res.status(400).json({ e });
        });


    });


    return router;

}

