const Mongoose = require('mongoose');


const { Schema } = Mongoose;

// User Schema
const UserSchema = new Schema({
  email : { type: String, require: true, index:true, unique:true,sparse:true},
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  password: {
    type: String
  },

  address: {
    type: String,
    require:true

  },

  city:{
    type: String,
    require: true,

  },

  zipcode:{
    type : Number,
    require: true
  },


  provider: {
    type: String,
    required: true,
    default: 'email'
  },
  // googleId: {
  //   type: String,
  //   unique: true
  // },
  // facebookId: {
  //   type: String,
  //   unique: true
  // },
  avatar: {
    type: String
  },
  history: {
    type: Array,
    default : []
  },
  role: {
    type: String,
    enum: ['ROLE_MEMBER', 'ROLE_ADMIN', 'ROLE_MERCHANT'],
    default: 'ROLE_MEMBER'
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

// UserSchema.plugin(passportlocalmongoose);

const User = Mongoose.model('User', UserSchema);


module.exports = User
