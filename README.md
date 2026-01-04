# AN API PROJECT : A product api project (mock shopping aplication..)

This project was created to demonstrate basic authentication operations using Node.js, Express.js, jsonwebtoken, bycrypt.js and MongoDB as well as morgan and nodemon. It also demonsrates the use of ejs and nodemailer in sending emails from the backend (and i added a bit of plain frontend pages for a demo front end). 

## URLS for testing and documentation (not locally)

### Postman documentation url

```
  https://documenter.getpostman.com/view/49958636/2sBXVcmYN3

```
### render base url
```
https://product-authapi-project.onrender.com

```

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
- update quantity of an item
- clear cart (all)
- a few ejs templates meant for mock frontend use(i couldn't make 2 work the way i wished)




## my folder structure
```
Book-api
|___src
|   |
|   |__app-config/
|   |  |__db.js
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

i did it following the structure that was taught but i moved a few things and added a few things, like rather than having the auth file under config, i found that it was best practice to have it in a midware file instead. i also added the few frontend ejs type templates because i was curious of how they ran (i didn't really connect them correctly).

## How to run the project

**Note, emails wont send because they have been commented out due to render not being able to send emails for free users. To make use of the emailing function, navigate to the auth controller file and uncomment everthing related to email-services (from the import to the related functions.)**

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
   mongo_url=your mongodb-url
   PORT=your port number
   jwt_secret=yourjwt secret code 
```
### D. Email Configuration (Required for email templates testing):
**create an app in gmail after setting up 2fa authentication**
```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your email address
   EMAIL_PASSWORD=your app password
   EMAIL_FROM_NAME=input name of your choice

```
**please use the exact same names or it won't connect**

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
after that, get the token from login and then use **thunderclient to test it out (under AUTH, bearer)**. use:
```
GET /api/users
```

---

### To create a product
Here you need to get the token displayed from login and then use thunderclient to test it out (under AUTH, bearer). otherwise it will fail.

- POST/api/products
you can test this example or something similar **(all fields are required)**

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

here you need to manually edit a user (default setting) to become an admin on the mongodb database or test with the token of the user that created the product. After that, get the token from login and then use thunderclient to test it out (under AUTH, bearer). **use same style to test the delete function**
```
PUT /api/products/<insert productId>
```
### To delete a product
```
DELETE /api/products/<insert productid>

```

---
  
### Add to Cart
**All cart routes require authentication, please use the auth token from login here, only the owner of the cart can assess it**

```
POST /api/cart

{
  "productId": "<product_id>"
}

```

### Get Cart Items
```
GET /api/cart

```

### Update Quantity
```
PUT /api/cart/quantity

eg;
{
  "productId": "{{product1_id}}",
  "quantity": 5
}

```

### Remove Item From Cart
```
DELETE /api/cart/<productId>

```

### Clear Cart
```
DELETE /api/cart

```

---

### mock frontend (note that it doesn't function as more than a visual placeholder);

- for login placeholder visuals
```
<your localhost base url/ test base url(like the render url)>/signin

```

- for signup placeholder visuals

```
<your localhost base url/ test base url(like the render url)>/register

```

- to view products visually (as in frontend)


```
<your localhost base url/ test base url(like the render url)>/products

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
- i ran into issues where postman would add extra characters to my request while i was testing the search by title and category end point. This was fixed 

- there are a lot of production bugs when testing with postman.

## extra info / late night adds

I worked a bit on some functions like searching by category in the controller. i also made sure otp was sent where needed ....for testing reasons. the cart was a last minute thought because there is no shopping application without a cart.

## Finally 

This is a product of zero christmas and new year rest or breaks and almost a ton of sleepless nights but i am satisfied with it. i only wish that i could have had more time to learn and attempted to link my ejs templates in a way that they are functional.

 