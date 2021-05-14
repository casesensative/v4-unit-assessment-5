const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    const db = req.app.get('db');
    const {username, password} = req.body;
    const result = await db.user.find_user_by_username(username);
    const existingUser = result[0];
    if (existingUser) {
      return res.status(409).send('Username taken.')
    } 
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredUser = await db.user.create_user(username, hash, `https://robohash.org/${username}.png`);
    const user = registeredUser[0];
    req.session.user = {
      id: user.user_id,
      username: user.username,
    };
    return res.send(req.session.user);


  },
  login: async (req, res) => {
    const db = req.app.get('db');
    const {username, password} = req.body;

    const result = await db.user.find_user_by_username(username);
    const existingUser = result[0];

    if (!existingUser) {
      return res.status(401).send('User not found. Please register')
    }

    const isAuthorized = bcrypt.compareSync(password, existingUser.password);

    !isAuthorized ? res.status(403).send('Incorrect password') : null;

    req.session.user = {
      id: existingUser.user_id,
      username: existingUser.username
    };

    return res.status(200).send(req.session.user);

    
  },
  getUser: (req, res) => {
   
    !req.session.user ? res.sendStatus(404) : res.status(200).send(req.session.user); //??? 

  },
  logout: (req, res) => {
    req.session.destroy();
    res.status(200).send('User logged out.');
  }
}