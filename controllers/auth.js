var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt');
var admin = require("firebase-admin");

const db = admin.firestore();
// define the home page route
router.post('/signin', function (req, res) {
    if(req.body.phoneNumber == null || req.body.phoneNumber == '' 
        || req.body.password == null || req.body.password == '' ){
        res.status(500).send({ data: 'Please fill all required fields'});
      return;
    }
    admin.auth().getUserByPhoneNumber(req.body.phoneNumber)
    .then(function(userRecord) {
        let usersRef = db.collection('users');
        usersRef.where('phoneNumber', '==', req.body.phoneNumber).get()
        .then(snapshot => {
        if (snapshot.empty) {
            res.status(404).send({ data:'No matching documents.' });
            return;
        }
        snapshot.forEach(doc => {
            bcrypt.compare(req.body.password, doc.data().password, function(err, res2) {
                if(res2) {
                    res.send({status: 200, data: doc.data()});
                    return;
                } else {
                    res.status(404).send({ data: 'Authentication Error, Password doesnot match' });
                    return;
                } 
              });
        });
  })

    })
    .catch(function(error) {
        res.status(500).send({ data: 'Error fetching user data:' + error });
    });
})

router.post('/signup', function (req, res) {
    if(req.body.phoneNumber == null || req.body.phoneNumber == '' 
        || req.body.password == null || req.body.password == '' 
        || req.body.name == null || req.body.name == '' 
        || req.body.nationalId == null || req.body.nationalId == '' 
        ){
            res.status(500).send({ data: 'Please fill all required fields' });
      return;
    }
    admin.auth().createUser({
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user: ', userRecord.uid);
          bcrypt.hash(req.body.password, 10, function(err, hash) {
            if (err){
                res.status(500).send({ data: 'Password Err. ' + err });
                return;
            }
            let data = {
                phoneNumber:req.body.phoneNumber ,
                name: req.body.name,
                password: hash,
                nationalId:req.body.nationalId,
                paymentSetup: false
              };
              
              db.collection('users').doc(userRecord.uid).set(data).then(function(data1){
                    res.send({status: 200, data: data})
              });
          });
          
        })
        .catch(function(error) {
            res.status(500).send({ data: 'Error creating new user: '+ error });
        });

})
module.exports = router