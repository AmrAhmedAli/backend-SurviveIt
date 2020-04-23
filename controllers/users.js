var express = require('express')
var router = express.Router()

var admin = require("firebase-admin");

const db = admin.firestore();
// define the home page route
router.get('/getUserByPhoneNumber/:phoneNumber', function (req, res) {
    if(req.params.phoneNumber == null){
        res.err({status: 500, data: 'Please enter a body'});
      return;
    }
    let usersRef = db.collection('users');
    usersRef.where('phoneNumber', '==', req.params.phoneNumber).get()
  .then(snapshot => {
    if (snapshot.empty) {
      res.err({status: 404, data:'No matching documents.'});
      return;
    }  

    snapshot.forEach(doc => {
      res.send({status: 200, data: doc.data()});
    });
  })
  .catch(err => {
    res.err({status: 500, data: 'Error getting documents: ' + err});
  });

})
router.get('/getUserByNationalID/:nationalID', function (req, res) {
    if(req.params.nationalID == null){
      res.err({status: 500, data: 'Please enter a body'});
      return;
    }
    let usersRef = db.collection('users');
    usersRef.where('nationalId', '==', req.params.nationalID).get()
  .then(snapshot => {
    if (snapshot.empty) {
      res.err({status: 404, data:'No matching documents.'});
      return;
    }  

    snapshot.forEach(doc => {
      res.send({status: 200, data: doc.data()});
    });
  })
  .catch(err => {
    res.err({status: 500, data: 'Error getting documents: '+ err});
  });

})

router.post('/addLocation', function(req, res){
  if(req.body.phoneNumber == null || req.body.location == null ){
    res.err({status: 500, data: 'Please enter a body'});
    return;
  }
  let usersRef = db.collection('users');
  usersRef.where('phoneNumber', '==', req.body.phoneNumber).get()
  .then(snapshot => {
    if (snapshot.empty) {
      res.err({status: 404, data:'User not found.'});
      return;
    }  

  snapshot.forEach(doc => {
    var items = 0;
    req.body.location.forEach(ele =>{
      usersRef
      .doc(doc.id).update({
        location: admin.firestore.FieldValue.arrayUnion(ele)
      }).then(function(aa){
        items++;
        if(items === req.body.location.length){
          res.send({status: 200});
          return;
        }
        
      })
    });
  });
})
.catch(err => {
  res.err({status: 500, data: 'Error getting documents: '+ err});
});

})

module.exports = router