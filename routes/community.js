const express = require('express')
const router = express.Router()
const { getAllCommunities, getCommunityBySlug, getTopPersonas } = require('../controllers/communityController')

// Public routes — no auth needed to browse communities
router.get('/', getAllCommunities)
router.get('/top-personas', getTopPersonas)
router.get('/:slug', getCommunityBySlug)

module.exports = router
