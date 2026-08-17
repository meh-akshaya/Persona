const express = require('express')
const router = express.Router()
const { getAllCommunities, getCommunityBySlug } = require('../controllers/communityController')

// Public routes — no auth needed to browse communities
router.get('/', getAllCommunities)
router.get('/:slug', getCommunityBySlug)

module.exports = router
