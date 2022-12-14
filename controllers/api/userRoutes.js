const router = require('express').Router();
const { User, Schedule } = require('../../models');

// Creates a new user!!
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const dbUserData = await User.create({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const user = dbUserData.get({ plain : true });
    console.log('USER 1', user);

    await Schedule.create({
      area: '',
      day: 'monday',
      mon: true,
      user_id: user.id,
    });
    await Schedule.create({
      area: '',
      day: 'tuesday',
      tue: true,
      user_id: user.id,
    });
    await Schedule.create({
      area: '',
      day: 'wednesday',
      wed: true,
      user_id: user.id,
    });
    await Schedule.create({
      area: '',
      day: 'thursday',
      thurs: true,
      user_id: user.id,
    });
    await Schedule.create({
      area: '',
      day: 'friday',
      fri: true,
      user_id: user.id,
    });
    await Schedule.create({
      area: '',
      day: 'saturday',
      sat: true,
      user_id: user.id,
    });
    await Schedule.create({
      area: '',
      day: 'sunday',
      sun: true,
      user_id: user.id,
    });

    req.session.save(() => {
      req.session.logged_in = true;
      req.session.user_id = user.id;
      res.status(200).json(dbUserData);
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login's a user!!
router.post('/login', async (req, res) => {
  try {
    // Find the user who matches the posted e-mail address
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // Verify the posted password with the password store in the database
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // Create session variables based on the logged in user
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true; 
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    // Remove the session variables
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});


module.exports = router;
