const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getMe, getUsers, deleteUser, getUser} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.route('/').post(registerUser).get(protect,getUsers)
// router.get('/me', protect, getMe)
router.route('/:id').delete(protect, deleteUser).get(protect,getUser)
router.post('/login', loginUser)

module.exports = router