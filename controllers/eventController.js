const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Events = mongoose.model('Events');

router.get('/', (req, res) => {
    res.render("event/addOrEdit", {
        viewTitle: "Insert events"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var events = new Events();
    events.fullName = req.body.fullName;
    events.save((err, doc) => {
        if (!err)
            res.redirect('event/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("event/addOrEdit", {
                    viewTitle: "Insert Events",
                    events: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Events.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('event/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("event/addOrEdit", {
                    viewTitle: 'Update event',
                    events: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Events.find((err, docs) => {
        if (!err) {
            res.render("event/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving Events list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Events.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("events/addOrEdit", {
                viewTitle: "Update Events",
                events: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Events.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/event/list');
        }
        else { console.log('Error in Events delete :' + err); }
    });
});

module.exports = router;