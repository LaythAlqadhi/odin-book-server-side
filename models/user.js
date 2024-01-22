const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    githubId: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      maxLength: 25,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    profile: {
      displayName: {
        type: String,
        maxLength: 25,
      },
      avatar: String,
      bio: {
        type: String,
        maxLength: 150,
      },
    },
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    followingRequests: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
