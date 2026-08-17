const express = require('express')
const router = express.Router()
const { addComment, getPostComments } = require('../controllers/commentController')
const authMiddleware = require('../middleware/auth')

// Get all comments for a post — public
router.get('/post/:postId', getPostComments)

// Add a comment or reply — requires login
router.post('/', authMiddleware, addComment)

module.exports = router