const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// step 1 :- connect to mongodb
const connect = () => {
  return mongoose.connect(
    // mongodb://127.0.0.1:27017/web14
    "mongodb+srv://Aniket:Aniket_1029@cluster0.jh1in.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  );
};

// step 2 :- create a schema
const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: false, default: "Male" },
    age: { type: Number, required: true },
    ip_address: { type: String, required: false },
  },
  {
    versionKey: false, // removed __v
    timestamps: true, // createdAt, updatedAt
  }
);

// step 3 :- create a model
const User = mongoose.model("user", userSchema); // user => users

// Relation User and Posts :- 1 to Many
// Foreign Keys
// ------------------ ViewAllMens MODEL ----------------------------------------------------
// step 2 - Schema
const ViewAllMensSchema = new mongoose.Schema(
  {
    brand:{type: String, required: true},
    title: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    color: {type: String,required: true},
    // [] ,
    img: { type: String, required: true },
    Hoverimg: { type: String, required: true },
  },
  {
    versionKey: false, // removed __v
    timestamps: true, // createdAt, updatedAt
  }
);

// step 3 - Model
const ViewMen = mongoose.model("ViewAllMen", ViewAllMensSchema); // post => posts

// ------------------ COMMENT MODEL ----------------------------------------------------
const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
  },
  {
    versionKey: false, // removed __v
    timestamps: true, // createdAt, updatedAt
  }
);

const Comment = mongoose.model("comment", commentSchema); // comment => comments

// ------------------ TAG MODEL ----------------------------------------------------
const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    versionKey: false, // removed __v
    timestamps: true, // createdAt, updatedAt
  }
);

const Tag = mongoose.model("tag", tagSchema); // tag => tags

//db.users.find()
// User => db.users

// admin, user, student, teacher, IA, SDE1

/*
  work with users collection
  GET => get /users
  POST => post /users
  GET SINGLE ITEM => get /users/:id
  UPDATE SINGLE ITEM => patch /users/:id
  DELETE SINGLE ITEM => delete /users/:id
*/

// ----------------------------- USERS CRUD -----------------------------------

app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);

    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/users", async (req, res) => {
  // thennable => proper then
  try {
    const users = await User.find().lean().exec(); // db.users.find() // proper promise

    return res.send(users);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// met + route => get /users/${variable} and the name of variable is id
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().exec();

    if (user) {
      return res.send(user);
    } else {
      return res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// met + route => patch /users/${variable} and the name of variable is id
app.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    res.status(201).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// met + route => delete /users/${variable} and the name of variable is id
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean().exec();

    res.send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/*
  work with tags collection
  GET => get /tags
  POST => post /tags
  GET SINGLE ITEM => get /tags/:id
  UPDATE SINGLE ITEM => patch /tags/:id
  DELETE SINGLE ITEM => delete /tags/:id
*/

// ----------------------------- TAG CRUD -----------------------------------
app.post("/tags", async (req, res) => {
  try {
    const tag = await Tag.create(req.body);

    return res.send(tag);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find().lean().exec();

    return res.send(tags);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/tags/:id", async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id).lean().exec();

    return res.send(tag);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.patch("/tags/:id", async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.send(tag);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.delete("/tags/:id", async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    return res.send(tag);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/*
  work with posts collection
  GET => get /posts
  POST => post /posts
  GET SINGLE ITEM => get /posts/:id
  UPDATE SINGLE ITEM => patch /posts/:id
  DELETE SINGLE ITEM => delete /posts/:id
*/

// ----------------------------- ViewAllMens CRUD -----------------------------------


app.get("/viewmen", async (req, res) => {
  try {
    let ViewAllMens;
    let filter = {};
    if(req.query.size) {
      filter.size = req.query.size;
    //  ViewAllMens = await ViewMen.find({size:req.query.size}).lean().exec();
    } 
    if(req.query.color) {
      filter.color = req.query.color;
      // ViewAllMens = await ViewMen.find({size:req.query.color}).lean().exec();
    } 
    if(filter == {}) {
      ViewAllMens = await ViewMen.find().lean().exec();
    } else {
      ViewAllMens = await ViewMen.find(filter).lean().exec();
    }
    
    return res.send(ViewAllMens);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/asc", async (req, res) => {
  try {
    const ViewAllMens = await ViewMen.find().sort({price:1}).lean().exec();

    return res.send(ViewAllMens);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/dec", async (req, res) => {
  try {
    const ViewAllMens = await ViewMen.find().sort({price:-1}).lean().exec();

    return res.send(ViewAllMens);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// app.get("/viewmen", async (req, res) => {
//   try {
//     const ViewAllMens = await ViewMen.find().lean().exec();

//     return res.send(ViewAllMens);
//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// });

app.post("/viewmen", async (req, res) => {
  try {
    const ViewAllMens = await ViewMen.create(req.body);

    return res.send(ViewAllMens);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/viewmen/:id", async (req, res) => {
  try {
    const ViewAllMens = await ViewMen.findById(req.params.id).lean().exec();

    return res.send(ViewAllMens);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.patch("/viewmen/:id", async (req, res) => {
  try {
    const ViewAllMens = await ViewMen.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.send(ViewAllMens);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.delete("/viewmen/:id", async (req, res) => {
  try {
    const ViewAllMens = await ViewMen.findByIdAndDelete(req.params.id).lean().exec();

    return res.send(ViewAllMens);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/*
  work with comments collection
  GET => get /comments
  POST => post /comments
  GET SINGLE ITEM => get /comments/:id
  UPDATE SINGLE ITEM => patch /comments/:id
  DELETE SINGLE ITEM => delete /comments/:id
*/

// ----------------------------- COMMENT CRUD -----------------------------------
app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate({
        path: "post_id",
        select: ["title", "body"],
        populate: [
          { path: "user_id", select: ["first_name", "last_name"] },
          { path: "tag_ids", select: ["name"] },
        ],
      })
      .lean()
      .exec();

    return res.send(comments);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post("/comments", async (req, res) => {
  try {
    const comment = await Comment.create(req.body);

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).lean().exec();

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.patch("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.delete("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id)
      .lean()
      .exec();

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.listen(2345, async function () {
  try {
    await connect();
    console.log("listening on port 2345");
  } catch (e) {
    console.log(e.message);
  }
});

// app.get("/user", logger1("admin"), (req, res) => {
//   res.send(req.role);
// });

// function logger1(role) {
//   return function (req, res, next) {
//     if (role == "admin") {
//       req.role = "admin";
//     } else {
//       req.role = "user";
//     }
//     next();
//   };
// }
