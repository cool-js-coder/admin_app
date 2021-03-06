const authenticService = require('../services/authentic.service');
var schema = require('../schema/loginValidationSchema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var errorMessage = require('../../common/error-methods');
var mail = require('./../../common/mailer.js');


const jwt = require('jsonwebtoken');

function init(router) {
    router.route('/login')
        .post(authentic); 
    router.route('/signup')
          .post(signup); 
    router.route('/socialSignup')
          .post(socialSignup); 
    router.route('/changepassword')
    .post(changePassword);
    router.route('/savepassword')
    .post(savepassword);
}
function changePassword(req,res) {
  var mailerInfo = req.body;
  var data = {
    email: mailerInfo.email,
    key: Math.floor((Math.random() * 1000000000000000) + 1)
  }
  authenticService.changePasswordReq(data).then( result => {
    mailerMsg = `<p>hi! this mail is regard to change password.</p><a href="${mailerInfo.url}${data.key}">${mailerInfo.url}</a>`;
    mail.forgotPasswordMail(mailerMsg, data.email).then( msg => {
      res.json({'message':'Your request for change password sent! Check your mail', 'success': true});
    }).catch(err => {
      console.log('error in mail send');
      res.json(err);
      console.log(err);
    });
  }).catch(err => {
    res.json(err);
  });
}
function savepassword(req, res) {
  authenticService.savePassword(req.body).then(response => {
    res.json({'response':response, 'success': true, 'message': "Your Password is update! do login with new password"});
  }).catch(err => {
    res.json(err);
  })
}
function authentic(req,res) {
  var authenticData=req.body;
  
  var json_format = iValidator.json_schema(schema.postSchema, authenticData, "authentic");
   
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }

   authenticService.authentic(authenticData).then((data) => {
   if(data) {
      var username = data.email;
      const token = jwt.sign({username},'my_secret_key',{ expiresIn: 60*60*24 });
      res.json({
        "success":true,
        "data":data,
        "token":token
      });
    }
  }).catch((err) => {
    mail.mail(err);
    res.json(err);
  });

}
function socialSignup(req, res) {
  var signUpData=req.body;
  
  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, signUpData, "signUpData");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  authenticService.socialSignup(signUpData).then((data) => {
    if(data) {
      var username = data.username;
      const token = jwt.sign({username},'my_secret_key',{ expiresIn: 60*60*24 });
      res.json({
        "success":true,
        "data":data,
        "token":token
      });
     }
  }).catch((err) => {
    mail.mail(err);
    res.json(err);
  });
}

function signup(req,res) {
  var signUpData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, signUpData, "signUpData");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }

   authenticService.signup(signUpData).then((data) => {
    if(data) {
       res.json({
         "success":true,
         "data":data
       });
     }
   }).catch((err) => {
     mail.mail(err);
     res.json(err);
   });

}



module.exports.init = init;



