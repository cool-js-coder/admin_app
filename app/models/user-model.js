var db = require('../../config/database');
var dbFunc = require('../../config/db-function');

var userModel = {
   getAllUser:getAllUser,
   addUser:addUser,
   updateUser:updateUser,
   deleteUser:deleteUser,
   getUserById:getUserById
}

function getAllUser() {
    return new Promise((resolve,reject) => {
        db.query(`SELECT * FROM users`,(error,rows,fields)=>{
            if(!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {
                dbFunc.connectionRelease;
                resolve(rows);
            }
       });
    });
}

function getUserById(id) {
    return new Promise((resolve,reject) => {
        db.query("SELECT * FROM users WHERE id ="+id.id,(error,rows,fields)=>{
            if(!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {
                dbFunc.connectionRelease;
                resolve(rows);
            }
       });
    });  
}

function addUser(user) {
     return new Promise((resolve,reject) => {
         db.query("INSERT INTO users(name,age,state,country)VALUES('"+user.name+"','"+user.age+"','"+user.state+"','"+user.country+"')",(error,rows,fields)=>{
            if(error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {
                dbFunc.connectionRelease;
                resolve(rows);
            }
          });
        });
}


function updateUser(id,user) {
    return new Promise((resolve,reject) => {
        db.query("UPDATE users set name='"+user.name+"',age='"+user.age+"',state='"+user.state+"',country='"+user.country+"' WHERE id='"+id+"'",(error,rows,fields)=>{
            if(!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {
                dbFunc.connectionRelease;
                resolve(rows);
            }
       });    
    })
}

function deleteUser(id) {
   return new Promise((resolve,reject) => {
        db.query("DELETE FROM users WHERE id='"+id+"'",(error,rows,fields)=>{
            if(!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {
                dbFunc.connectionRelease;
                resolve(rows);
            }
       });    
    });
}


module.exports = userModel;

