const router = require('express').Router();
const { Blog, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all blogs and JOIN with user data
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
        },
      ],
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogs, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
      ],
    });

    const blogs = blogData.get({ plain: true });

    res.render('blog', {
      ...blogs,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const blogs = await Blog.findAll({ 
      where: {
        user_id: req.session.user_id
      },
      raw: true
    })

    // const user = userData.get({ plain: true });

    res.render('profile', {
      blogs,
      logged_in: true
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/api/blogs', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
        }
      ]
    })

    const blogs = blogData.map((blog) => blog.get({ plain: true }))

    res.json(blogs);
  } catch (err) {
    res.status(500).json(err);

  }
})

module.exports = router;
