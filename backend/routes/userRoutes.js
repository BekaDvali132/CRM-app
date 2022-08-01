const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getUsers, deleteUser, getUser, editUser, sendCode, submitCode} = require('../controllers/userController')
const {protect, protectAdmin} = require('../middleware/authMiddleware')

router.route('/').post(registerUser).get(protect,getUsers)
router.post('/send-code', sendCode)
router.post('/submit-code', submitCode)
router.route('/:id').delete(protect, deleteUser).get(protectAdmin,getUser).put(protectAdmin, editUser)
router.post('/login', loginUser)

module.exports = router