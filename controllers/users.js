var express = require('express')
var router = express.Router()

var admin = require("firebase-admin");

const db = admin.firestore();
// define the home page route
router.get('/getUserByPhoneNumber/:phoneNumber', function (req, res) {
    if(req.params.phoneNumber == null){
        res.send({status: 500, data: 'Please enter a body'});
      return;
    }
    let usersRef = db.collection('users');
    usersRef.where('phoneNumber', '==', req.params.phoneNumber).get()
  .then(snapshot => {
    if (snapshot.empty) {
      res.send({status: 404, data:'No matching documents.'});
      return;
    }  

    snapshot.forEach(doc => {
      res.send({status: 200, data: doc.data()});
    });
  })
  .catch(err => {
    res.send({status: 500, data: 'Error getting documents: ' + err});
  });

})
router.get('/getUserByNationalID/:nationalID', function (req, res) {
    if(req.params.nationalID == null){
      res.send({status: 500, data: 'Please enter a body'});
      return;
    }
    let usersRef = db.collection('users');
    usersRef.where('nationalID', '==', req.params.nationalID).get()
  .then(snapshot => {
    if (snapshot.empty) {
      res.send({status: 404, data:'No matching documents.'});
      return;
    }  

    snapshot.forEach(doc => {
      res.send({status: 200, data: doc.data()});
    });
  })
  .catch(err => {
    res.send({status: 500, data: 'Error getting documents: '+ err});
  });

})


module.exports = router