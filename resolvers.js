import { createToken, verifyToken } from "./auth.js";

export const resolvers = {
  Query: {
    getToken: async (_, { email }, { User }) => {
      const user = await User.find({ email });
      if (user) return createToken(user[0].email);
      return "There is no such email";
    },
    getUsers: async (_, args, { User }) => {
      const users = await User.find();
      return users;
    },
    getTweets: async (_, { token }, { Tweet }) => {
      if (verifyToken(token)) {
        const tweets = await Tweet.find();
        return tweets;
      } else {
        return "token is missing";
      }
    },
    getUserTweets: async (_, { user }, { Tweet }) => {
      const tweets = await Tweet.find({ user }).populate({
        path: "user",
        model: "Tweet",
      });
      return tweets;
    },
    getUserLikedTweets: async (_, { _id }, { User }) => {
      const tweets = await User.findById({ _id }).populate("likesTweet");
      return tweets.likesTweet;
    },
    deleteTweet: async (_, { _id }, { Tweet }) => {
      await Tweet.findOneAndRemove({ _id });
      return console.log("tweet was deleted...");
    },
  },
  Mutation: {
    createTweet: async (
      _,
      { token, title, user, username, text, images },
      { Tweet, User }
    ) => {
      if (verifyToken(token)) {
        const newTweet = await new Tweet({
          title,
          user,
          username,
          text,
          images,
        }).save();

        await User.findOneAndUpdate(
          { user },
          { $addToSet: { tweets: newTweet._id } },
          { new: true }
        ).populate({ path: "tweets", model: "Tweet" });
        return newTweet;
      } else {
        return "token is missing";
      }
    },
    login: async (_, { username, _email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      } else if (password !== user.password) {
        throw new Error("Invalid Password");
      }
      return {
        token: createToken(user),
        username: user.username,
        _id: user._id,
        likesTweet: user.likesTweet,
      };
    },
    createUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exists");
      }
      const newUser = await new User({
        username,
        email,
        password,
      }).save();

      return {
        token: createToken(newUser),
        username,
        _id: newUser._id,
      };
    },
    addLike: async (_, { _id, username }, { Tweet, User }) => {
      const tweet = await Tweet.findOneAndUpdate(
        { _id },
        { $inc: { likes: 1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { likesTweet: tweet } },
        { new: true }
      ).populate({ path: "likesTweet", model: "Tweet" });
      await tweet
        .updateOne(
          {
            $addToSet: { likedUser: user },
          },
          { new: true }
        )
        .populate({ path: "likedUser", model: "Tweet" });
      return { likes: tweet.likes, likesTweet: user.likesTweet };
    },
    unLike: async (_, { _id, username }, { Tweet, User }) => {
      const tweet = await Tweet.findOneAndUpdate(
        { _id },
        { $inc: { likes: -1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { likesTweet: tweet._id } },
        { new: true }
      ).populate({ path: "likesTweet", model: "User" });
      await tweet
        .updateOne(
          {
            $pull: { likedUser: user._id },
          },
          { new: true }
        )
        .populate({ path: "likedUser", model: "Tweet" });
      return { likes: tweet.likes, likesTweet: user.likesTweet };
    },
  },
};
