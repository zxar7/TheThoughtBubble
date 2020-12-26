//This is the file that connects to the database

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/the_thought_bubble',{useNewUrlParser:true,useFindAndModify:false});

const db = mongoose.connection;

//check if the connection was successful
db.once('error',console.error.bind(console,'Connection error'),function(){console.log("There was an error connecting")});
db.once('open',function(){console.log("Connection Successful")});

//Define the schema for the database
let Schema = mongoose.Schema;


//Define the schemas

//User
const userSchema = new Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    thoughts:[{type:Schema.Types.ObjectId, ref:'Thought'}]
})

//Thought
const thoughtSchema = new Schema({
    user:{type:Schema.Types.ObjectId, ref:'User',required:true},
    username:{type:String,required:true},
    thought:{type:String,required:true},
    topicTitle:{type:String,required:true},
    topic:{type:Schema.Types.ObjectId, ref:'Topic'}
},{timestamps:true});

//Topic
const topicSchema = new Schema({
    title:{type:String,required:true,unique:true},
    content:[{type:Schema.Types.ObjectId, ref:'Thought',required:true}]
},{timestamps:true});


//Create a model around the schema created
const Thought = mongoose.model('Thought',thoughtSchema);
const Topic = mongoose.model('Topic',topicSchema);
const User = mongoose.model('User',userSchema);

//Export the collection
module.exports.Thought = Thought;
module.exports.Topic = Topic;
module.exports.User = User;
module.exports.mongoose = mongoose;

//method to create a new user with password
module.exports.User.createNewUser = function(newUser , callback){
    bcrypt.genSalt(10,function(err, salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

//method to compare user password at login
module.exports.User.comparePassword = function(password, user, callback){
    bcrypt.compare(password, user[0].password)
    .then((userMatch)=>{
        console.log("password match successful!")
        callback(null,userMatch); 
    }) 
    .catch((err) => {
        console.log("User sent is ",user);
        console.log("Error occured while decrypting password",err);
    })
}