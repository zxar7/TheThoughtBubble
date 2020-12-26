//This is the connecting point of this app

//Set up the express app
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./main').User;
const Thought = require('./main').Thought;
const Topic = require('./main').Topic;
const mongoose = require('./main').mongoose
const app = express();
const router = express.Router();


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(router);


//Set connection to listen in port 8080
app.listen(8080,()=>{
    console.log('listening on port:8080');
  });  


//Search for thoughts based on topic - search bar 
router.get('/thoughts/:topic',function(req,res){

    Thought.find({topicTitle: { $regex: '.*' + req.params.topic + '.*' , $options: 'i'} }).sort({createdAt:-1}).exec(function(err,thoughts){
        if(err){
            console.log("Error occured while trying to retrieve the titles",err)
            return;
        }
        else {
            if(thoughts.length>0){
                console.log("Sending the thoughts");
                return res.send(thoughts)
            }
            else return res.send({});
        }
    });
})

//Search for topics based on the title
router.get('/topic/:title',function(req,res){
    
    Topic.find().exec(function(err,topics){
        if(err){
            console.log("Error occured while trying to retrieve the titles",err)
            return;
        }
        else {
            if(topics.length>0){
                console.log("Sending the title");

                Topic.findOne({title:req.params.title})
                .populate('content').
                exec(function (err, topic) {
                    if (err) return handleError(err);
                    let names = []
                    console.log('the length is',topic)
                    topic.content.forEach(thought => {
                        console.log('The name of the guy is is %s', thought.username);
                        names.push(thought);
                    });
                    return res.send(names);
                  });
            }
            else return res.send();
        }
    });
})

//Check if someone has had this thought
router.get("/checkThought/:topicTitle",(req,res)=>{

    Thought.find({topicTitle: { $regex: '.*' + req.params.topicTitle + '.*' , $options: 'i'}})
    .exec((err,thought)=>{

        if(err) {
            console.log("Error finding matchng thought");
            return;
        }
        else {
            console.log("res here is", thought.length)
            length = {length:thought.length}
            return res.send(length)
        }
    })
    
})

//Create a thought
router.post('/saveThought',function(req,res){
    //find the thinker
    User.find({username:req.body.username})
    .then(thinker => {
        console.log('thinker is  ',thinker);
        return thinker[0];
    })
    .then(thinker => {
        const  newThought = new Thought({
            _id : new mongoose.Types.ObjectId(),
            username : req.body.username,
            thought : req.body.thought,
            topicTitle:req.body.topicTitle.trim().replace(/\s\s+/g,' '),
            user : thinker._id
        }) 
        
        if(req.body.topicTitle === undefined || req.body.topicTitle === null ||req.body.topicTitle ==='' ){
            console.log('topicTitle is empty??????')
        }
        else{
            console.log(`topicTitle: is ${req.body.topicTitle}`)
            console.log("thinker is 2 ",thinker)
        }
        
        
        newThought.save(function(err){
            if (err) return console.log('Error outer',err);

            Topic.find({title:req.body.topicTitle})
            .then(topic => {

                User.find({username:req.body.username})
                .then(user => {return user[0]})
                .then(user => {
                    let thoughtIds = user.thoughts;
                    thoughtIds.push(newThought._id);
                    User.findOneAndUpdate({username:req.body.username},{thoughts:thoughtIds})
                    .then(user => {
                        console.log("new user details are ",user);
                    })
                })

                console.log('topic content is ',topic.length);

                if(topic.length > 0){
                    console.log('topic 0 content',topic[0].content);
                    let cont = topic[0].content;
                    cont.push(newThought._id);
                    console.log('new content of id ',cont,topic[0]._id)
                    Topic.findOneAndUpdate({title:req.body.topicTitle},{content:cont})
                    .then((topic)=>{
                        console.log('now topic is',topic);
                        newThought.thought = topic._id
                        console.log('Successfully saved old')
                        return res.send({result:"saved"})
                    })
                    
                }
                else{
                    const newTopic = new Topic({
                        _id: new mongoose.Types.ObjectId(),
                        title:req.body.topicTitle,
                        content:newThought._id
                    })
                    newTopic.save(function(err){
                        if (err) return console.log('Error inner',err);
                        else {
                            newThought.thought = newTopic._id

                            console.log('Successfully saved new')
                            return res.send({result:"saved"})
                        }
                    }).then(topic => {
                        console.log('newly created topic is ',topic)
                        return res.send({result:"saved"})
                    }) 
                }
            })
        })
    })   
})


//Check if user already exists
router.get('/check/:user',(req,res)=>{
    console.log('inside the get check user');
    let user = req.params.user;
    User.find({username: { $regex: '.*' + user + '.*' , $options: 'i'} }).exec(function(err,user){
        if(err){
            console.log("Error occured while trying to retrieve the users",err)
            return;
        }
        else {
            if(user.length>0){
                console.log("User found",user);
                console.log("Sending the user type",);
                return res.send({result:"Found match"})
            }
            else {
                console.log("No matching user");
                return res.send({result:"No match"})
            }
        }
    })
})

//Create new user 
router.post('/signup',(req,res)=>{
    console.log('inside post register')
    console.log('body name is',req.body)
    let username = req.body.username.trim().replace(/\s\s+/g, ' ');
    let password = req.body.password;
    console.log('User sent is ',username);
    let newUser = new User({
        username: username,
        password: password
    });

    User.createNewUser(newUser, function(err,user){
        if(err) throw err;
        console.log("user name is ",user.username);

        res.send(user)
    })
});

//Find user with matching credentials - from login
router.post("/userlogin",(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    User.find({username: { $regex: '.*' + username + '.*' , $options: 'i'} }).exec(function(err,user){
        if(err){
            console.log("Error occured while trying to retrieve the users",err)
            return;
        }
        else {
            console.log("matching user found:",user)
            if(user.length>0){
               User.comparePassword(password, user, (err, isMatch)=>{
                    if(err) throw err;  
                    if(isMatch){
                        console.log("ismatch value inside valid is ",isMatch);
                        res.send({result:"Valid credentials"});
                    } else {
                        console.log("ismatch value inside invalid is ",isMatch);
                        res.send({result:"Invalid credentials"});
                    }
               })
            }else {
                console.log("Could not find this user")
                res.send({result:"Invalid User"})
            }
        }
    });
})

//searching for a user's thoughts
 router.get('/mythoughts/:username',async (req,res)=>{
    let username = req.params.username;
    Thought.find({username:username}).sort({createdAt:-1})
    .then((thoughts)=>{
        console.log("thoughts here is ",thoughts);
        let toSend = []
        if(thoughts.length>0){
            thoughts.forEach(thought => {
                let details = {
                    topic :thought.topicTitle,
                    message:thought.thought,
                    date:thought.updatedAt
                }
                toSend.push(details)
            });
            console.log("tosend here is ",toSend);
            return res.send(toSend);
        }else{
            return res.send(toSend);
        }
    })
});

//Delete a user's thought
router.delete('/remove/:topic',(req,res)=>{
    //thought id
    let id = '';
    console.log("request params topic is -",req.params.topic);
    let topic = req.params.topic.trim().replace(/\s\s+/g,' ');
    Thought.findOne({topicTitle: topic  })
    .then(thought => {
        id = thought._id;
        console.log("Thought here is ",id);
        Thought.findByIdAndDelete(id,(err,res)=>{
            if(err){
                console.log("error while deleting, ",err);
                return;
            }
            else {
                console.log("This is the deleted object? ",res)
            }
        })
        return id;
    }).then(id => {
        console.log("Printing the id here ,",id);
        //Will need to remove the user
        User.find({thoughts:id})
        .then(res=>res[0])
        .then(res=>{
            console.log("This is the user details ,",res);
            let thoughts = res.thoughts; 
            let index =  thoughts.indexOf(id);
            thoughts.splice(index,1)
            console.log("Resulting array is ",thoughts)
            return thoughts;
        })
        .then(newList => {
            User.findOneAndUpdate({thoughts:id},{thoughts:newList})
            .then(result => {
                console.log("Whats the result here ",result);
                let tosend = {result:'success'}
                return res.send(tosend)
            })
        })
    })
})


//Editing the thought
router.put('/edit/:topic',(req,res)=>{
    let newThought = req.body.thought;
    let topicTitle = req.params.topic
    console.log("printing all the values, thought:"+newThought+" topic:"+topicTitle)
    Thought.findOneAndUpdate({topicTitle:topicTitle},{thought:newThought})
    .then(data=>{
        console.log("The value sent back is , ",data)
        if(data!==null){
            console.log("sending success")
            let rest = {result:'success'};
            return res.send(rest);
        }else {
            console.log("sending failure")
            let rest = {result:'failure'};
            return res.send(rest)
        }
    })
})