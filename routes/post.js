const express = require('express')
const router = express.Router()
const { createPost, getAllPosts, getPostById } = require('../controllers/postController')
const authMiddleware = require('../middleware/auth')

// Feed is public — anyone can read anonymous posts
router.get('/', getAllPosts)
router.get('/:id', getPostById)

// Creating a post requires a logged-in persona
router.post('/', authMiddleware, createPost)

module.exports = router
