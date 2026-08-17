const express = require('express')
const router = express.Router()
const { addReaction, removeReaction } = require('../controllers/reactionController')
const authMiddleware = require('../middleware/auth')

// Both routes require authentication — you must be logged in to react
router.post('/', authMiddleware, addReaction)
router.delete('/:postId', authMiddleware, removeReaction)

module.exports = router