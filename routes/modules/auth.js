const express = require('express')
const user = require('../../models/userSchema')
const passport = require('passport')
const { ensureAuth, forwardAuth } = require('../../config/authentication')
// const { emailVerify, passwordVerify } = require('../../public/javascripts/authValidate.js')
// 上面的引用因為改版 所以用不到 但是因為是不同寫法所導致 所以暫時保留改檔案

const router = express.Router()

// login page routing
router.get('/', forwardAuth, (req, res) => {
  res.render('auth', { title: 'Authentication', layout: 'loginPage' })
})

// registration page routing
router.get('/register', forwardAuth, (req, res) => {
  res.render('register', { title: 'Authentication', layout: 'loginPage' })
})

// facebook login routing
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/auth',
  failureFlash: true
})
)

// user logout routing
router.get('/logout', (req, res) => {
  const username = req.user ? req.user.name : 'Sir'
  req.logout()
  req.flash('msg', `${username} You have successfully logout`)
  res.redirect('/auth')
})

// use local strategy routing
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/auth',
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect('/')
  }
)

// 這個路由改用處理資料庫的錯誤訊息當作練習
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  const errors = []
  if (password !== password2) {
    errors.push({ msg: 'the passwords do not match each other' })
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      layout: 'loginPage'
    })
  } else {
    user.create({
      name, 
      email,
      password 
    })
    .then(user => {
      req.flash('msg', 'Your registration is successful')
      res.redirect('/auth')
    })
    .catch(err => {
      const errors = []
      if (err.code === 11000) {
        const email = err.keyValue.email
        errors.push(`${email} has been registered, please check.`)
      } else {
        Object.values(err.errors).forEach(({ properties }) => {
          return errors.push(properties.message)
        })
      } 
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2,
        layout: 'loginPage'
      })
    })
  }
})

module.exports = router