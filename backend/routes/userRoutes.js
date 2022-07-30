const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getMe,getUsers,deleteUser} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.route('/').post(registerUser).get(protect,getUsers)
router.route('/:id').delete(protect, deleteUser).get()
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router