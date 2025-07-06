const express = require('express');
const { registerUser, loginUser,
      getAllUsers,
  deleteUser,
  updateUserRole,
 } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);               // GET كل المستخدمين
router.delete('/:id', deleteUser);          // DELETE مستخدم
router.patch('/:id/role', updateUserRole);

module.exports = router;
