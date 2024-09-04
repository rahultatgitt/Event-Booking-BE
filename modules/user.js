//Initialize Libraries
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var AWS = require('aws-sdk'),
    fs = require('fs');

//Initialize Models
var User = require('../models/User');
const keys = require("../config/keys");
// var Otp = require('../models/OTP');
const crypto = require('crypto');
const ticket = require('../models/ticket');

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

// Define TPA login Module
exports.Adminlogin = (body) => {
    // return User.register(body);

    return new Promise((resolve, reject) => {
        User.findOne({ email: body.email }).then((user) => {
            // console.log("user",user);
            if (user && user.user_type === '') {

                bcrypt.compare(body.password, user.password, function (err, isMatch) {
                    if (err) {
                        throw err
                    } else if (!isMatch) {
                        reject({ "error": "Password doesn't match!" })
                    } else {
                        console.log("Password matches!")
                        var payload = {
                            id: user.id,
                            name: user.name,
                            mobile: user.mobile,
                            email: user.email,
                            role: user.role,
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
            else {
                reject({ "error": "email id  doesn't match!" })
            }

        }).catch((err) => {
            reject(err)
        })

    });
}
//Define User signup OTP verification module
exports.verifyOtp = (body) => {
    // return User.register(body);

    console.log("recieved verify otp req");

    return new Promise((resolve, reject) => {

        User.findOne({ mobile: body.mobile }).then((user) => {
            console.log("user found", user);
            if (user) {
                //Check already confirm or not.
                if (user.is_active == 0 || !user.is_active) {
                    console.log("now confirming otp", body.otp, user.confirmOtp);
                    console.log(typeof body.otp);
                    //Check account confirmation.

                    if (user.confirmOtp == body.otp || body.otp == 1234) { //Added cheat otp
                        console.log("now checking otp");
                        //Update user as confirmed
                        User.findOneAndUpdate({ mobile: body.mobile }, {
                            is_active: 1,
                            confirmOtp: null
                        }).catch(err => {
                            return reject(err);
                        });
                        //return resolve("Account confirmed successfully");
                        //return resolve(user);
                        // Create JWT Payload
                        var payload = {
                            id: user.id,
                            name: user.name,
                            mobile: user.mobile,
                            user_type: user.user_type,
                            acceptTOS: user.acceptTOS,
                            acceptPP: user.acceptPP,
                            video_skipped: user.video_skipped,
                            video_watched: user.video_watched,
                            mySp: user.mySp
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
                                    // success: true,
                                    // token: "Bearer " + token,
                                    token: token
                                })
                            }
                        );
                    } else {
                        return reject("Otp does not match");
                    }
                } else {
                    //return reject("Account already confirmed.");
                    //return resolve(user);
                    if (user.confirmOtp == body.otp || body.otp == 1234) { //Added cheat otp
                        console.log("now confirming otp", body.otp, user.confirmOtp);
                        console.log(typeof body.otp);
                        // Create JWT Payload
                        var payload = {
                            id: user.id,
                            name: user.name,
                            mobile: user.mobile,
                            user_type: user.user_type,
                            profile_pic: user.profile_pic,
                            acceptTOS: user.acceptTOS,
                            acceptPP: user.acceptPP,
                            video_skipped: user.video_skipped,
                            video_watched: user.video_watched,
                            mySp: user.mySp
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
                                    // success: true,
                                    // token: "Bearer " + token,
                                    token: token
                                })
                            }
                        );
                    } else {
                        return reject("Otp does not match");
                    }
                }
            } else {
                return reject("Specified mobile number not found.");
            }

        })

    });
}


exports.resendOtp = (body) => {
    // return User.register(body);

    return new Promise((resolve, reject) => {

        User.findOne({ mobile: body.mobile }).then((user) => {
            if (user) {
                console.log('user', user)
                //Check already confirm or not.
                // if (user.is_active == 0) {
                // Generate otp
                // console.log("body", user);
                Otp.find({ mobile: body.mobile })
                    .then((result) => {
                        console.log('result', result);
                        console.log('------', result[result.length - 1]);
                        console.log((result[result.length - 1].created_at.getTime() / 1000) / 60);
                        console.log((result[result.length - 5].created_at.getTime() / 1000) / 60);
                        const now = new Date();
                        const diff = ((now.getTime() / 1000) / 60) - ((result[result.length - 4].created_at.getTime() / 1000) / 60);
                        console.log("diff", diff);
                        const lastOTP = new Date(result[result.length - 1].created_at);
                        const lastOtpDate = lastOTP.getDate();
                        const lastOtpMonth = lastOTP.getMonth();
                        const lastOtpYear = lastOTP.getFullYear();
                        console.log('lastOTP', lastOtpDate, lastOtpMonth, lastOtpYear);
                        // const lastOTP = new Date(result[result.length - 1].created_at);
                        const nowDate = now.getDate();
                        const nowMonth = now.getMonth();
                        const nowYear = now.getFullYear();
                        console.log('nowOTP', nowDate, nowMonth, nowYear);
                        // const diffLast = (now.getTime() / 1000)  - lastOTP;
                        // console.log("diffLast", diffLast);
                        if (nowDate === lastOtpDate && nowMonth === lastOtpMonth && nowYear === lastOtpYear) {
                            if (diff < 60) {
                                reject("OTP Limit exceeded")
                            } else {
                                console.log("result[result.length - 41", result[result.length - 1]);
                                let otp = result[result.length - 1].otp;
                                // Html email body
                                var newOtp = new Otp({
                                    mobile: body.mobile,
                                    otp: otp,
                                    type: "resend"
                                });
                                const message = otp + ' is your OTP for QZap. Please enter the OTP to verify your mobile number in QZap.';
                                let smsResult = sms.gupshup_send(body.mobile, message);
                                // let html = "<p>Please Confirm your Account.</p><p>OTP: " + otp + "</p>";
                                console.log("resend otp inside if", smsResult);
                                // Send confirmation email
                                // mailer.send(
                                //     constants.confirmEmails.from, 
                                //     req.body.email,
                                //     "Confirm Account",
                                //     html
                                // ).then(function(){
                                user.is_active = 0;
                                user.confirmOtp = otp;
                                // Save user.
                                newOtp
                                    .save()
                                    .then((otp) => resolve(otp))
                                    .catch((err) => reject(err))

                                //Add sms gateway plugin to send otp here
                                console.log("verifcation otp", otp);
                                user.save()
                                    .then(user => resolve(user))
                                    .catch(err => reject(err));
                            }
                        } else {
                            let otp = utility.randomNumber(4);
                            // Html email body
                            var newOtp = new Otp({
                                mobile: body.mobile,
                                otp: otp,
                                type: "resend"
                            });
                            const message = otp + ' is your OTP for QZap. Please enter the OTP to verify your mobile number in QZap.';
                            let smsResult = sms.gupshup_send(body.mobile, message);
                            // let html = "<p>Please Confirm your Account.</p><p>OTP: " + otp + "</p>";
                            console.log("resend otp inside else", smsResult);
                            // Send confirmation email
                            // mailer.send(
                            //     constants.confirmEmails.from, 
                            //     req.body.email,
                            //     "Confirm Account",
                            //     html
                            // ).then(function(){
                            user.is_active = 0;
                            user.confirmOtp = otp;
                            // Save user.
                            newOtp
                                .save()
                                .then((otp) => resolve(otp))
                                .catch((err) => reject(err))

                            //Add sms gateway plugin to send otp here
                            console.log("verifcation otp", otp);
                            user.save()
                                .then(user => resolve(user))
                                .catch(err => reject(err));
                        }
                    })

                // });
                // } else {
                //return reject("Account already confirmed.");
                // }
            } else {
                return reject("Specified mobile not found.");
            }

        })

    });
}

//Define User accept Legal Module
// exports.acceptLegal = (body) => {
//     console.log("recv request for marking legal", body);
//     // return User.register(body);

//     return new Promise((resolve, reject) => {

//         User.findOne({ _id: body.user_id }).then((user) => {
//             if (!user) {

//                 reject({ "error": "Account doesn't exists" });
//             } else {
//                 var newActivityLog = new ActivityLog({
//                     user_id: body.user_id,
//                     content: body.content,
//                     version: body.version,
//                     event_type: 'TOS_ACCEPT'
//                 });

//                 // if(body.acceptedTOS) {
//                 newActivityLog.event_description = 'Accept Terms of Service';
//                 user.acceptTOS = 1;
//                 // }
//                 // else {
//                 //     newActivityLog.event_description = 'Didn\'t Accept Terms of Service';
//                 //     user.acceptTOS = 0;
//                 // }
//                 newActivityLog.save()
//                     .then((activityLog) => {
//                         user.save()
//                             .then(user => resolve(activityLog, user))
//                             .catch(err => reject(err));
//                     })
//                     .catch(err => reject(err));
//             }
//         })
//             .catch((error) => { reject(error) });
//     });
// }
//Define User accept Legal Module
exports.acceptLegal = (body) => {
    console.log("recv request for marking legal", body);
    // return User.register(body);

    return new Promise((resolve, reject) => {

        User.findOne({ _id: body.user_id }).then((user) => {
            if (!user) {
                reject({ "error": "Account doesn't exists" });
            } else {
                var tosActivityLog = new ActivityLog({
                    user_id: body.user_id,
                    event_type: 'Accept Terms of Services',
                    event_description: body.tos_content,
                    event_version: body.tos_version
                });

                var ppActivityLog = new ActivityLog({
                    user_id: body.user_id,
                    event_type: 'Accept Privacy Policy',
                    event_description: body.pp_content,
                    event_version: body.pp_version
                });

                // if(body.acceptedTOS) {
                user.acceptTOS = 1;
                user.acceptPP = 1;
                // }
                // else {
                //     newActivityLog.event_description = 'Didn\'t Accept Terms of Service';
                //     user.acceptTOS = 0;
                // }
                tosActivityLog.save()
                    .then((tosactivityLog) => {
                        ppActivityLog.save()
                            .then((ppactivityLog) => {
                                user.save()
                                    .then((user) => {
                                        // resolve(activityLog, user))
                                        var payload = {
                                            id: user.id,
                                            name: user.name,
                                            mobile: user.mobile,
                                            user_type: user.user_type,
                                            profile_pic: user.profile_pic,
                                            acceptTOS: user.acceptTOS,
                                            acceptPP: user.acceptPP,
                                            video_skipped: user.video_skipped,
                                            video_watched: user.video_watched,
                                            mySp: user.mySp
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
                                                    // success: true,
                                                    // token: "Bearer " + token,
                                                    token: token
                                                })
                                            }
                                        );
                                    })
                                    .catch(err => reject(err));
                            })
                            .catch(err => reject(err))
                    })
                    .catch(err => reject(err));
            }
        })
            .catch((error) => { reject(error) });
    });
}

exports.userType = (body) => {
    console.log("recv request for marking user type", body);
    // return User.register(body);

    return new Promise((resolve, reject) => {

        User.findOne({ _id: body.user_id }).then((user) => {
            if (!user) {

                reject({ "error": "Account doesn't exists" });
            } else {
                user.user_type = body.user_type;
                user.save()
                    .then(user => {
                        // resolve(user)
                        var payload = {
                            id: user.id,
                            name: user.name,
                            mobile: user.mobile,
                            user_type: user.user_type,
                            profile_pic: user.profile_pic,
                            acceptTOS: user.acceptTOS,
                            acceptPP: user.acceptPP,
                            video_skipped: user.video_skipped,
                            video_watched: user.video_watched,
                            mySp: user.mySp
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
                                    // success: true,
                                    // token: "Bearer " + token,
                                    token: token
                                })
                            }
                        );
                    })
                    .catch(err => reject(err));
            }
        })
            .catch((error) => { reject(error) });
    });
}

exports.video = (body) => {
    console.log("recv request for marking video", body);
    // return User.register(body);

    return new Promise((resolve, reject) => {

        User.findOne({ _id: body.user_id }).then((user) => {
            if (!user) {

                reject({ "error": "Account doesn't exists" });
            } else {
                if (body.event === 'watched') {
                    user.video_watched = 1;
                }
                else {
                    user.video_watched = 0;
                }

                var newActivityLog = new ActivityLog({
                    user_id: body.user_id,
                    event_type: 'Video',
                    event_description: body.event,
                    event_design: body.language
                });


                newActivityLog.save()
                    .then((activityLog) => {
                        user.save()
                            .then(user => resolve(user))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            }
        })
            .catch((error) => { reject(error) });
    });
}

exports.login = (body) => {
    return new Promise((resolve, reject) => {

        var mobile = body.mobile;
        //var password = body.password;

        // Find user by mobile
        User.findOne({ mobile }).then(user => {
            // Check if user mobile
            if (!user) {
                // return res.status(404).json({ emailnotfound: "Email not found" });
                //reject({ "error": "Mobile not found" });
                var otp = utility.randomNumber(4);


                var newUser = new User({
                    user_type: " ",
                    mobile: body.mobile,
                    confirmOtp: otp
                });

                var newOtp = new Otp({
                    mobile: mobile,
                    otp: otp,
                    type: "login"
                });

                const message = otp + ' is your OTP for QZap. Please enter the OTP to verify your mobile number in QZap.';
                let smsResult = sms.gupshup_send(mobile, message);
                console.log("smsResult", smsResult);

                newOtp
                    .save()
                    .then((result) => resolve(result))
                    .catch((err) => reject(err))

                //Add sms gateway plugin to send otp here
                console.log("verifcation otp", otp);

                newUser
                    .save()
                    .then(user => resolve(user))
                    .catch(err => reject(err));
            }

            else {

                //Add sms gateway plugin to send otp here
                // console.log("verifcation otp", otp);

                Otp.find({ mobile: mobile })
                    .then((result) => {
                        // console.log("result", result);

                        if (!result) {
                            var otp = utility.randomNumber(4);
                            var newOtp = new Otp({
                                mobile: mobile,
                                otp: otp,
                                type: "login"
                            });
                            const message = otp + ' is your OTP for QZap. Please enter the OTP to verify your mobile number in QZap.';
                            let smsResult = sms.gupshup_send(mobile, message);
                            console.log("smsResult", smsResult);

                            newOtp
                                .save()
                                .then((result) => {
                                    console.log("new entry otp", result);

                                    resolve(result)
                                })
                                .catch((err) => reject(err))
                            user.confirmOtp = otp;
                            console.log('Updated user', user);
                            user.save()
                                .then(user => {
                                    console.log("final resolve", user);

                                    resolve(user)
                                })
                                .catch(err => reject(err));
                        } else {
                            if (result.length < 1) {
                                var otp = utility.randomNumber(4);
                                var newOtp = new Otp({
                                    mobile: mobile,
                                    otp: otp,
                                    type: "login"
                                });
                                const message = otp + ' is your OTP for QZap. Please enter the OTP to verify your mobile number in QZap.';
                                let smsResult = sms.gupshup_send(mobile, message);
                                console.log("smsResult", smsResult);

                                newOtp
                                    .save()
                                    .then((result) => {
                                        console.log("new entry otp", result);

                                        resolve(result)
                                    })
                                    .catch((err) => reject(err))
                                user.confirmOtp = otp;
                                console.log('Updated user', user);
                                user.save()
                                    .then(user => {
                                        console.log("final resolve", user);

                                        resolve(user)
                                    })
                                    .catch(err => reject(err));
                            } else {
                                const now = new Date();
                                const lastOTP = new Date(result[result.length - 1].created_at);
                                const lastOtpDate = lastOTP.getDate();
                                const lastOtpMonth = lastOTP.getMonth();
                                const lastOtpYear = lastOTP.getFullYear();
                                console.log('lastOTP', lastOtpDate, lastOtpMonth, lastOtpYear);
                                // const lastOTP = new Date(result[result.length - 1].created_at);
                                const nowDate = now.getDate();
                                const nowMonth = now.getMonth();
                                const nowYear = now.getFullYear();
                                console.log('nowOTP', nowDate, nowMonth, nowYear);

                                if (nowDate === lastOtpDate && nowMonth === lastOtpMonth && nowYear === lastOtpYear) {
                                    var otp = result[result.length - 1].otp;
                                    var newOtp = new Otp({
                                        mobile: mobile,
                                        otp: otp,
                                        type: "login"
                                    });
                                    const message = otp + ' is your OTP for QZap. Please enter the OTP to verify your mobile number in QZap.';
                                    let smsResult = sms.gupshup_send(mobile, message);
                                    console.log("smsResult", smsResult);

                                    newOtp
                                        .save()
                                        .then((result) => {
                                            console.log("new entry otp", result);

                                            resolve(result)
                                        })
                                        .catch((err) => reject(err))
                                    user.confirmOtp = otp;
                                    console.log('Updated user', user);
                                    user.save()
                                        .then(user => {
                                            console.log("final resolve", user);

                                            resolve(user)
                                        })
                                        .catch(err => reject(err));
                                } else {
                                    console.log("else case");
                                    var otp = utility.randomNumber(4);
                                    var newOtp = new Otp({
                                        mobile: mobile,
                                        otp: otp,
                                        type: "login"
                                    });
                                    const message = otp + ' is your OTP for QZap. Please enter the OTP to verify your mobile number in QZap.';
                                    let smsResult = sms.gupshup_send(mobile, message);
                                    console.log("smsResult", smsResult);

                                    newOtp
                                        .save()
                                        .then((result) => {
                                            console.log("new entry otp", result);

                                            resolve(result)
                                        })
                                        .catch((err) => reject(err))
                                    user.confirmOtp = otp;
                                    console.log('Updated user', user);
                                    user.save()
                                        .then(user => {
                                            console.log("final resolve", user);

                                            resolve(user)
                                        })
                                        .catch(err => reject(err));
                                }
                            }
                        }
                    })
                console.log("otp after drama", otp);
                // resolve(user);
            }
        })
            .catch((error) => { reject(error) });
    });
}

exports.uploadImage = (file, scid) => {

    return new Promise((resolve, reject) => {
        // if (!file) reject("No file found");
        // if (!/^image\/(jpe?g|png|gif)$/i.test(file1.mimetype)) {
        //     return res.status(403).send('expect image file').end();
        // }
        console.log('', keys.accessKeyId, keys.secretAccessKey, keys.bucket)

        let s3bucket = new AWS.S3({
            accessKeyId: keys.accessKeyId,
            secretAccessKey: keys.secretAccessKey,
            Bucket: keys.bucket,
            region: keys.region,
            apiVersion: '2006-03-01'
        });


        // s3bucket.createBucket(function () {
        let BucketPath = 'uploads';
        //Where you want to store your file
        var ResponseData = [];

        // file.map((item) => {
        var params = {
            Bucket: keys.bucket,
            Key: 'uploads/' + scid + '/' + scid + '.jpg',
            Body: file.buffer,
            ACL: 'public-read'
        };


        User.findOne({ _id: scid }).then(user => {
            // Check if user mobile
            if (!user) {
                // return res.status(404).json({ emailnotfound: "Email not found" });
                reject({ "error": "User not found" });
            }
            s3bucket.upload(params, function (err, data) {
                console.log("data,err", data, err);
                if (err) reject(err);

                console.log("data.loc", data.Location)
                user.profile_pic = data.Location;

                if (user && user.profile_pic) {

                    // Save user.
                    user.save()
                        .then(user => resolve(user))
                        .catch(err => reject(err));

                } else {

                    reject({ "error": "Error uploading profile photo" });

                }


            });
        });

    });
}


exports.fetchClientData = () => {

    return new Promise((resolve, reject) => {

        // const usage_id = params && params.usage_id;
        User.aggregate([
            {
                "$match": {
                    user_type: "client"
                }
            },
            {
                "$addFields": {
                    "stringId": { "$toString": "$_id" }
                }
            },
            {
                "$lookup": {
                    from: "license",
                    localField: "stringId",
                    foreignField: "user_id",
                    as: "license_details"
                }
            },
            {
                "$project": {
                    "stringId": 0  // Optionally exclude the temporary field
                }
            }
        ])

            // .select('bill_id bill_no total_amount net_payable currency start_date end_date remarks')
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            })

    })

}
//inserted last backup and purge data
exports.clientBackupStatus = (body) => {
    return new Promise((resolve, reject) => {
        // Extract the email from params
        // const email = body && body.email;
        const data = body
        var newBackup = new backup({
            from_date: data.from_date,
            to_date: data.to_date,
            no_of_days: data.no_of_days,
            // is_backup: data.is_backup,
            // is_purge: data.is_purge,
            type: data.type,
            status: data.status,
            type_val: data.type_val
        })
        newBackup.save()
            .then((result) => {
                 console.log("Backup created", result);
                 resolve(result)
 
            })
            .catch((error) => {
                 console.log(error);
                 reject(error);
             })
        
    });
}

function decrypt(data, key, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
    let decrypted = decipher.update(Buffer.from(data, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }


  exports.clientBackup = (param,body) => {
    return new Promise(async (resolve, reject) => {
        const key = Buffer.from('qwed34rfgt6yhju78ikmnbvftgy765tg'); // Must be 32 bytes for AES-256
        const iv = Buffer.from('etgd54hfhty73652');  // Initialization vector must be 16 bytes
        const data = body.data;
        const id = param.id;

        if (data) {
            try {
                let dData = decrypt(data, key, iv);
                let parsedData = JSON.parse(dData);
                console.log("Decrypted data: ", parsedData);
                // ClientDataBackup.update(parsedData,{new: true})
                // .then(res  => {
                //     console.log("res", res);
                //     resolve(res)
                // })
                // .catch(err => {
                //     console.log("err", err);
                //     reject(err)
                // })

                // // Check if parsedData is an array
                if (Array.isArray(parsedData)) {
                    var i = 0;
                    for (const item of parsedData) {
                        let newBackup = await ClientDataBackup.findOneAndUpdate({id},item,{new: true,upsert: true});
                        // Save each item to the database
                        // const newBackup = new ClientDataBackup({
                        //     id: item._id,
                        //     claim_number: item.claim_number,
                        //     incident_details: item.incident_details, // Adjust this if needed
                        //     enrollment_details: item.enrollment_details
                        // });
                        console.log("newBackup", newBackup)

                        // await newBackup.save();
                        if((parsedData.length - 1) == i) {
                            resolve("success")
                        }
                        i++
                    }
                } else {
                    // If parsedData is not an array, handle it as a single object
                    const newBackup = new ClientDataBackup({
                        id: parsedData._id,
                        claim_number: parsedData.claim_number,
                        incident_details: parsedData.incident_details,
                        enrollment_details: parsedData.enrollment_details
                    });

                    await newBackup.save();
                }

                resolve("Successfully saved decrypted data.");
            } catch (error) {
                console.error("Decryption or saving failed:", error);
                reject("Failed to save decrypted data.");
            }
        } else {
            reject("No data provided.");
        }
    });
};


// exports.clientBackup = (body) => {
//     return new Promise(async (resolve, reject) => {
//         // Extract the email from params
//         const key = Buffer.from('qwed34rfgt6yhju78ikmnbvftgy765tg'); // Must be 32 bytes for AES-256
//         const iv = Buffer.from('etgd54hfhty73652');  // Initialization vector must be 16 bytes
//         const data = body.data;
//         // console.log(data);
//         if (data) {
//             // let key = 'your_static_16by9uftdatefgxcw32b';
//             // console.log("key", key);
//             let dData = decrypt(data, key, iv)
//             // console.log("Encrypted data: ", JSON.parse(dData))
//             let parsedData = JSON.parse(dData);
//             console.log("Decrypted data: ", parsedData);

//             // Save decrypted data to the database
//             const newBackup = new ClientDataBackup({
//                 // data: parsedData
//                 id: parsedData._id,
//                 claim_number: parsedData.claim_number,
//                 incident_dettails: parsedData.incident_dettails,
//                 enrollment_details: parsedData.enrollment_details

//             });

//             newBackup.save()
//                 .then(() => {
//                     resolve("Successfully saved decrypted data.");
//                 })
//                 .catch(error => {
//                     console.log(error);
//                     reject("Failed to save decrypted data.");
//                 });
//         } else {
//             reject("No data provided.");
//         }
//     });
// };

        // Find the user by email
        // User.findOne({ email: email })
        //     .then(result => {
        //         if (result) {
        //             // Check if the user_type is 'client'
        //             if (result.user_type === "client") {
        //                 // Resolve with the result if user_type is 'client'
        //                 resolve(result);
        //             } else {
        //                 // Reject if user_type is not 'client'
        //                 reject(new Error("User type is not 'client'"));
        //             }
        //         } else {
        //             // Reject if no user found
        //             reject(new Error("User not found"));
        //         }
        //     })
        //     .catch(error => {
        //         console.log(error);
        //         reject(error);
        //     });
    // });
// }
//perticular clients all data
exports.fetchClientDetails = (body) => {
    return new Promise((resolve, reject) => {
        // Extract the email from params
        const email = body && body.email;
        // console.log(decoded);

        // Find the user by email
        User.findOne({ email: email })
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
    });
}


// last backup and purge details
exports.paginatedBackupDetail = (body) => {
    return new Promise((resolve, reject) => {
        // Extract pagination parameters from the body
        const page = parseInt(body.page) || 0; // Default to page 1 if not specified
        const limit = parseInt(body.limit) || 5; // Default to 5 items per page if not specified
        const sortBy = body.sortBy || 'createdAt'; // Field to sort by, default to 'createdAt'
        const sortOrder = body.sortOrder === 'asc' ? 1 : -1; // Default to descending order

        // Calculate the number of items to skip
        const skip = (page) * limit;

        // Find the user by email
        backup.find({type:'backup'})
            .sort({ [sortBy]: sortOrder }) // Apply sorting
            .skip(skip)
            .limit(limit)
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
    });
}

exports.paginatedPurgeDetail = (body) => {
    return new Promise((resolve, reject) => {
        // Extract pagination parameters from the body
        const page = parseInt(body.page) || 0; // Default to page 1 if not specified
        const limit = parseInt(body.limit) || 5; // Default to 5 items per page if not specified
        const sortBy = body.sortBy || 'createdAt'; // Field to sort by, default to 'createdAt'
        const sortOrder = body.sortOrder === 'asc' ? 1 : -1; // Default to descending order

        // Calculate the number of items to skip
        const skip = (page) * limit;

        // Find the user by email
        backup.find({type: 'purge'})
            .sort({ [sortBy]: sortOrder }) // Apply sorting
            .skip(skip)
            .limit(limit)
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
    });
}

