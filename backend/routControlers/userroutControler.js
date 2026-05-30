import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../uitls/jwtwebToken.js"


export const userRegister = async(req, res) => {
  try {
    const { fullname, username, email, gender, password, profilepic } =
      req.body;

    if (!gender) {
      return res.status(400).send({
        success: false,
        message: "Gender is required",
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      return res.status(409).send({
        success: false,
        message: "Username or Email already exists",
      });
    }

    const hashPassword = bcryptjs.hashSync(password, 10);
    const profileBoy =
      profilepic ||
      `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const profileGirl =
      profilepic ||
      `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
      gender,
      profilepic: gender === "male" ? profileBoy : profileGirl,
    });

    if (newUser) {
      await newUser.save();
      jwtToken(newUser._id,res)
    } else {
      res.status(500).send({ success: false, message: "Invalid User Data" });
    }
    res.status(201).send({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      profilepic: newUser.profilepic,
      email: newUser.email,
      message: "Registration successful",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || error,
    });
    console.log(error);
  }
};
export const userLogin = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({ email });
    if (!user)
      return res.status(401).send({
        success: false,
        message: "Email not found. Please register.",
      });

    const comparePass = bcryptjs.compareSync(password, user.password || "");
    if (!comparePass)
      return res.status(401).send({
        success: false,
        message: "Email or password is incorrect",
      });

    jwtToken(user._id, res);
    res.status(200).send({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilepic: user.profilepic,
      email: user.email,
      message: "successful login",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || error,
    });
    console.log(error);
  }
}




export const userLogout = async (req, res) => {
  try {
    res.cookie("jwt",'',{
        maxAge:0
    })
    res.status(200).send({sucess:true,message:"user LogOut"})
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};
