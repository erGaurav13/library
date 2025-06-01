const authController = require('./AuthController/auth.controller');
const booksController = require('./booksController/books.controller');
const reservcationController = require('./reservcationController/reservation.controller');
const RoomController = require('./roomController/room.controller');
module.exports = { authController, booksController, reservcationController, RoomController };
