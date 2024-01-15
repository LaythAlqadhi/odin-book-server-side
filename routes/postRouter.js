const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.post('/post', postController.postCreateNewPost);


module.exports = router;