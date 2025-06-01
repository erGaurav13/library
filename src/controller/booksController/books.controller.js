// controllers/book.controller.js
const bookService = require('./books.service');

class BookController {
  async createBook(req, res) {
    try {
      if (req.user.role !== 'librarian') throw new Error('Forbidden');
      const book = await bookService.createBook(req.body);
      res.status(201).json(book);
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }

  async getBooks(req, res) {
    try {
      const books = await bookService.getBooks();
      res.status(200).json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateBook(req, res) {
    try {
      if (req.user.role !== 'librarian') throw new Error('Forbidden');
      const book = await bookService.updateBook(req.params.id, req.body);
      res.status(200).json(book);
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }

  async deleteBook(req, res) {
    try {
      if (req.user.role !== 'librarian') throw new Error('Forbidden');
      await bookService.deleteBook(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }
}
module.exports = new BookController();