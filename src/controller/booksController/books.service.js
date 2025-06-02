// services/book.service.js
const {BookModel} = require('../../model/index.model');

class BookService {
  async createBook(bookData) {
    bookData.availableCopies = bookData.copies;
    return BookModel.create(bookData);
  }

  async getBooks() {
    return BookModel.find();
  }

  async updateBook(id, updateData) {
    if (updateData.copies) {
      const book = await BookModel.findById(id);
      const diff = updateData.copies - book.copies;
      updateData.availableCopies = book.availableCopies + diff;
    }
    return BookModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteBook(id) {
    return BookModel.findByIdAndDelete(id);
  }

  async getBookById(id) {
    return BookModel.findById(id);
  }
  
}
module.exports = new BookService();