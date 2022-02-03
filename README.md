# MyeCommerce
Final project of the backend programming course - coderhouse -> MyeCommerce

The E-Commerce Backend is a REST API for an internet retail website. The API is built onto an **Express.js** server that uses moongose to interact with a **MongoDB** database. 

This backend has API routes pointing to each of the standard [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations for products and has log in and sign up routes for the users.
To be able to obtain / create / modify / delete products you must log in as "admin".
If you are logged in as a user, you can simply add / remove products from the cart, obtain them and make purchases (if there are products in the cart).
The use of the cart is volatile, persistence is generated at the time of making a purchase.
For the case of the user session, **Passport** Local was used with a configurable expiration time.
Messaging functionality was added, since when registering a user an email is sent to the administrator and in case of making a purchase an SMS is sent to the client and a whastsapp to the administrator (these points were made in a didactic way
All that is missing to make this a complete eCommerce website is a simple front end application that makes calls to the API routes that are already built in.



