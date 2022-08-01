const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getMe, getUsers, deleteUser, getUser, editUser} = require('../controllers/userController')
const {protect, protectAdmin} = require('../middleware/authMiddleware')

router.route('/').post(registerUser).get(protect,getUsers)
// router.get('/me', protect, getMe)
router.route('/:id').delete(protect, deleteUser).get(protectAdmin,getUser).put(protectAdmin, editUser)
router.post('/login', loginUser)

module.exports = router