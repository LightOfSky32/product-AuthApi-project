# AN API PROJECT : A product api project (mock shopping aplication..)

This project was created to demonstrate basic authentication operations using Node.js, Express.js, jsonwebtoken, bycrypt.js and MongoDB as well as morgan and nodemon. It also demonsrates the use of ejs and nodemailer in sending emails from the backend (and i added a bit of plain frontend pages for a demo front end). although 


## The features of this api:
  
    The features include the ability to: 

- Sign up/ register
- Login
- Reset Password
- Forget Password 
- Verify Otp
- Resend Otp
- Get All Users (specifically only for admin);
- Add a book (specific to an admin and a user who has a token (logged in));
- View all books
- View a single book by id
- update a book (specifically only for admin and creator via token);
- delete a book (specifically only for admin and creator via token);
- search books by title
- search books by category
- Add an item to cart
- view/ get cart
- delete an item from the cart




## my folder structure
```
Book-api
|___src
|   |
|   |__app-config/
|   |  |__database.js
|   |__controllers/
|   |  |__auth-controllers.js
|   |  |__cart-controllers.js
|   |  |__product-controllers.js
|   |__middleware/
|   |  |__auth-midware.js
|   |__models/
|   |  |__product.js
|   |  |__user.js
|   |___routes/
|   |   |__auth-routes.js
|   |   |__product-routes.js
|   |   |__cart-routes.js
|   |   |__temp-routes.js //contains routes to something of a frontend rendered with ejs.
|   |___utils/
|      |__email-services.js
|
|___template/     
|   |__(a lot of ejs files)
|___node_modules/     (not included in commit)
|   |__(a lot of files)
|___.env (not included in commit)
|___.gitignore
|___package.json
|___package-lock.json
|___server.js
|___README.md

```

i did it follouwing the structure that was taught but i moved a few things and added a few things, like rather than having the auth midware under config, i found that it was best practice to have it in a midware file instead. i also added the few frontend ejs type templates because i was curious of how they ran.

## How to run the project

### A. download the project file or clone it:

to clone use 

```
   git clone <insert this repoistory-link>
```

### B. install the dependencies:

just open a terminal and run 

``` 
npm install 
```

### C. create a .env file in the main folder:
it should contain a db link from mongodb and a jwt secret key as well as the following variables
example:

```
   mongo_url=mongodb-url
   PORT=port number
   jwt_secret=yourjwt secret code 
```
### D. Email Configuration (Required for email templates testing):
create an app in gmail after setting up 2fa authentication
```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your email address
   EMAIL_PASSWORD=your app password
   EMAIL_FROM_NAME=input name of your choice

```
please use the exact same names or it won't connect

### E. start the server 

use 

```
  npm run dev

```

### D to close the server

use ctrl + C


## Testing the server's functionality

using thunder client, you can try this

### To create a user (Signup)

- POST/api/auth/sign-up
you can test this example:

```
 {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123"
}


```

### to verify the otp
```
 POST /api/auth/verify-otp
```
after this, use an object {otp: (the otp)}
### login
PUT /api/auth/login
```
 {
  "email": "john@example.com",
  "password": "mypassword123"
}

```
### to test forget password
PUT /api/auth/forget-password
```
{
  "email": "john@example.com"
}

```
you should be able to get an otp
### Reset password
PUT /api/auth/reset-password
```
 {
  "otp": "insert otp as a string",
  "newPassword": "newpassword123"
}

```
 
### Resend Otp
PUT /api/auth/resend-otp
```
{
  "email": "john@example.com"
}

```
a new otp should be given
### Get all users (admin specific)

here you need to manually edit a user (default setting) to become an admin on the mongodb database. 
after that, get the token from login and then use thunderclient to test it out (under AUTH, bearer). use:
```
GET /api/users
```

### To create a product
here you need to get the token displayed from login and then use thunderclient to test it out (under AUTH, bearer). otherwise it will fail.

- POST/api/products
you can test this example or something similar (all fields are required)

```
 {
  "title": "iPhone 15",
  "description": "Brand new iPhone with A17 chip",
  "category": "Phones and electronics",
  "price": 500000
}

```

### Get all products
```
 GET /api/products
```
### Get a product by id
```
 GET /api/products/<insert productid>
```

### Search by title
```
GET /api/products/search/title?title=<insert-title>
```
### Search by category
```
GET /api/products/search/category?category=<insert-category>
```

### To update a product

here you need to manually edit a user (default setting) to become an admin on the mongodb database or test with the token of the user that created the product. After that, get the token from login and then use thunderclient to test it out (under AUTH, bearer). use same style to test the delete function

```
PUT /api/products/<insert productId>
```
### To delete a product
```
DELETE /api/products/<insert productid>
```

## Assumptions (stuff i believe anyone who opens this knows/ has)

- first of all, an understanding of javaScript and a code editor if you plan to download this
- Node.js and npm already installed
- Mongod community server or atlas  & mongoDB Compass, both installed and working well
- you will be creating an env. with the correct names for the database as per earlier descriptions
- that can test this with Thunder Client extension.

## Bugs i worked on:

- i had an while testing my reset password route because rather than using the token sent via email, i tested using the hashed one from the datadbase.

- i had a bunch of typo errors with spellings and missed brackets

- i had error while testing out the create endpoint, more because i didn't fill all the required parameters

there are like 2 or three others but i think this is good.

## extra info / late night adds

I worked a bit on some functions like searching by category in the controller. i also made sure otp was sent where needed ....for testing reasons.

 