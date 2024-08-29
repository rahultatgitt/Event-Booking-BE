//Initialize Libraries
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var AWS = require('aws-sdk'),
    fs = require('fs');

//Initialize Models
var User = require('../models/User');
// var ActivityLog = require('../models/ActivityLog');
const keys = require("../config/keys");



// const ActorEventLog = require("../models/ActorEventLog");

// Define TPA signup Module
exports.AdminSignUp = (body) => {
    // return User.register(body);

    return new Promise((resolve, reject) => {
        console.log("body", body)
        User.findOne({ email: body.email }).then((user) => {
            if (user) {
                reject({ "error": "email id already registered" });
            } else {
                var newUser = new User({
                    user_type: body.user_type,
                    email: body.email,
                    password: body.password,
                });

                // Hash password before saving in database
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) reject(err);
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) reject(err);
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => resolve(user))
                            .catch(err => reject(err));
                    });
                });

            }
        })

    });
}


exports.Adminlogin = (body) => {
    // return User.register(body);

    return new Promise((resolve, reject) => {
        User.findOne({ email: body.email }).then((user) => {
            // console.log("user",user);
            if(user && user.user_type === 'super_user'){

                bcrypt.compare(body.password, user.password, function(err, isMatch) {
                    if (err) {
                      throw err
                    } else if (!isMatch) {
                      reject({"error":"Password doesn't match!"})
                    } else {
                      console.log("Password matches!")
                      var payload = {
                        id: user.id,
                        name: user.name,
                        mobile: user.mobile,
                        email:user.email,
                        role:user.role,
                        user_type: user.user_type,
                        // acceptTOS: user.acceptTOS,
                        // acceptPP: user.acceptPP,
                        // video_skipped: user.video_skipped,
                        // video_watched: user.video_watched,
                        // mySp: user.mySp
                    };
                    // Sign token
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {
                            expiresIn: 31556926 // 1 year in seconds //parse from config
                        },
                        (err, token) => {
                            // res.json({
                            //     success: true,
                            //     token: "Bearer " + token
                            // });
                            return resolve({
                                // user:user,
                                token: token
                            })
                        }
                    );
                    }
                  })                
            }
            else{
                reject({"error":"email id  doesn't match!"})
            }
        
        }).catch((err)=>{
            reject(err)
        })

    });
}



exports.logout = (request) => {

    return new Promise((resolve, reject) => {

        const user = request.user;

        const newActorEventLog = new ActorEventLog({
            event_timestamp: new Date(),
            actor: user._id, // User _id
            role: "TPA",
            event_name: "logout", // eg. Login, Adjudication List, Adjudicatoon details, approvals
        });
        newActorEventLog.save()
            .then((result) => {
                resolve("Sucess");
            })
            .catch(error => reject(error))

    })
}