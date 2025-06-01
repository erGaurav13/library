const express = require('express');
const router = express.Router();

const { booksController } = require('../../controller/index.controller');
const { auth } = require('../../middleware/index.middleware');

// Book routes

router.post('/books', auth, booksController.createBook);
router.get('/books', auth, booksController.getBooks);
router.put('/books/:id', auth, booksController.updateBook);
router.delete('/books/:id', auth, booksController.deleteBook);

module.exports = router;
