var express = require('express')
var router = express.Router()

var admin = require("firebase-admin");

const db = admin.firestore();
// define the home page route
router.get('/getUserByPhoneNumber/:phoneNumber', function (req, res) {
    if(req.params.phoneNumber == null){
      res.status(500).send({ data: 'Please enter a body'});
      return;
    }
    let usersRef = db.collection('users');
    usersRef.where('phoneNumber', '==', req.params.phoneNumber).get()
  .then(snapshot => {
    if (snapshot.empty) {
      res.status(500).send({data:'No matching documents.'});
      return;
    }  

    snapshot.forEach(doc => {
      res.send({status: 200, data: doc.data()});
    });
  })
  .catch(err => {
    res.status(500).send({data: 'Error getting documents: ' + err});
  });

})
router.get('/getUserByNationalID/:nationalID', function (req, res) {
    if(req.params.nationalID == null){
      res.status(500).send({data: 'Please enter a body'});
      return;
    }
    let usersRef = db.collection('users');
    usersRef.where('nationalId', '==', req.params.nationalID).get()
  .then(snapshot => {
    if (snapshot.empty) {
      res.status(404).send({data:'No matching documents.'});
      return;
    }  

    snapshot.forEach(doc => {
      res.send({status: 200, data: doc.data()});
    });
  })
  .catch(err => {
    res.status(500).send({ data: 'Error getting documents: '+ err});
  });

})

router.post('/addLocation', function(req, res){
  if(req.body.phoneNumber == null || req.body.location == null ){
    res.status(500).send({ data: 'Please enter a body'});
    return;
  }
  let usersRef = db.collection('users');
  usersRef.where('phoneNumber', '==', req.body.phoneNumber).get()
  .then(snapshot => {
    if (snapshot.empty) {
      res.status(404).send({ data:'User not found.'});
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
  res.status(500).send({ data: 'Error getting documents: '+ err });
});

})

router.post('/setcreditcard', function(req, res){
  if(req.body.creditcard == null || req.body.phoneNumber == null ){
    res.status(500).send({ data: 'Please enter a body'});
    return;
  }
  let usersRef = db.collection('users');
  usersRef.where('phoneNumber', '==', req.body.phoneNumber).get()
  .then(snapshot => {
    if (snapshot.empty) {
      res.status(404).send({ data:'User not found.'});
      return;
    }  

  snapshot.forEach(doc => {
    usersRef
    .doc(doc.id).update({
      creditcard: req.body.creditcard,
      paymentSetup: true
    }).then(function(aa){
        res.send({status: 200});
        return;
    })
  });
})
.catch(err => {
  res.status(500).send({ data: 'Error getting documents: '+ err });
});
})

router.post('/setinfected', function(req, res){
  if(req.body.infected == null || req.body.phoneNumber == null ){
    res.status(500).send({ data: 'Please enter a body'});
    return;
  }
  let usersRef = db.collection('users');
  usersRef.where('phoneNumber', '==', req.body.phoneNumber).get()
  .then(snapshot => {
    if (snapshot.empty) {
      res.status(404).send({ data:'User not found.'});
      return;
    }  

  snapshot.forEach(doc => {
    usersRef
    .doc(doc.id).update({
      infected: req.body.infected
    }).then(function(aa){
        res.send({status: 200});
        return;
    })
  });
})
.catch(err => {
  res.status(500).send({ data: 'Error getting documents: '+ err });
});
})
module.exports = router