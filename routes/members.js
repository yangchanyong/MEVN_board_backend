const router = require('express').Router();
const Member = require('../models/member');

const register = router.post('/signup', (req, res) => {
    Member.create(req.body)
        .then(member => res.send(member))
        .catch(err => res.status(500).send(err));
});

const memberList = router.get('/memberList', (req, res) => {
    Member.findAll()
        .then((members) => {
            if(!members.length) {
                return res.status(404).send({err: 'Member not found'});
            }
            // res.send(`find successfully : ${members}`)
            res.json(members)
        })
        .catch(err => res.status(500).send(err));
});

const updateMember = router.put('/:username', (req, res) => {
    Member.updateByMember(req.params.username, req.body)
        .then(member => res.send(member))
        .catch(err => res.status(500).send(err));

    // Member.findOne({username : req.params.username})
    //     .then(member => {
    //         if(!member) {
    //             return res.status(404).send('Member not found');
    //         }
    //         res.send(member);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).send('Internal Server Error');
    //     })
});

const deleteMember = router.delete('/delete/:username', (req, res) => {
    Member.deleteByMember(req.params.username)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});

module.exports = router;