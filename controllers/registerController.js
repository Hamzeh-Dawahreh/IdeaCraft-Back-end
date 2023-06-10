const bcrypt = require("bcrypt");
const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || password)
    return res
      .status(400)
      .json({ message: "Username and Password are required" });

  //check for duplicates
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict
  try {
    const hashedPassword = await bcrypt.hash(password, 8); //represents the number of salt rounds used for generating the hash
    const result = await User.create({
      username: uesr,
      password: hashedPassword,
    });
    console.log(result);
    res.status(201).json({ success: `${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { handleNewUser };
