module.exports = function(app, Member) {
    app.post('/signup', async function(req, res){
        try {
            const member = new Member();
            member.username = req.body.username;
            member.pw = req.body.pw;
            member.nickName = req.body.nickName;

            await member.save();
            res.json({ message : 'signup success!'});
        } catch (err) {
            console.log(err);
            res.json({message : 'signup failed!'});
        }
    });
    app.get('/memberList', async function(req, res) {
        try {
            const members = await Member.find({});
            if(members.length === 0) {
                return res.status(404).json({error: 'the user ID does not exist.'});
            }
            res.json(members);
        }catch (err) {
            return res.status(500).json({error : err.message});
        }
    })
    app.put('/memberUpdate/:username', async function(req, res) {
      try {
          const memberInfo = await Member.findOne({username: req.params.username});
          const member = await Member.findByIdAndUpdate(memberInfo.id, {pw: req.body.pw});
          if(!member) {
              return res.status(404).json({error: 'the ID does not exist.'})
          }
          await member.save();
          res.json('Update Complete.')
      }catch (err) {
          return res.status(500).json({error: err.message});
      }
      app.delete('/memberRemove', async function(req, res) {
          try {
              const userInfo = await Member.findOne({username: req.body.username});
              const result = await Member.deleteOne({_id:userInfo.username});
              if(result.deletedCount === 0) {
                  return res.status(404).json({error: 'The userID does not exist.'});
              }
          }catch (err) {
              return res.status(500).json({error:err.message})
          }
          res.json('Delete Member Complete');
      })
    });
}