const express = require('express');
const app = express();
const paypal = require('@paypal/checkout-server-sdk');

const cors = require('cors');

const port = process.env.PORT || 1500;
const mongoose = require('mongoose');
const loginModel = require('./models/login');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const newbookModel = require('./models/adnewbook');
const InterModel = require('./models/Interbook');
const bestsellerModel = require('./models/bestseller');
const fdModel = require('./models/feedback');
const cartModel = require('./models/cart');
const paymentModel = require('./models/payment');
const awardwinsModel = require('./models/awardwins');
const authModel = require('./models/login');

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.static('public')); // Specify the directory for serving static files

mongoose.connect('mongodb://127.0.0.1:27017/LM', {

})
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Destination directory for storing images
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Generate unique filename
    }
});

const upload = multer({ storage: storage });

//payment
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL;

// SIGNUP
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await loginModel.create({ name, email, password: hash });
        res.json({ status: "success" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await loginModel.findOne({ email });

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const userResponse = {
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    _id: user._id,
                };
                res.json(userResponse);
            } else {
                res.status(400).json({ error: 'Incorrect password' });
            }
        } else {
            res.status(400).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ADMIN
// POST method for adding a new book
app.post('/postnewbook', upload.single('image'), async (req, res) => {
    try {
        const { name, author, description, price } = req.body;
        const image = req.file.filename; // Get filename of uploaded image

        const newBook = await newbookModel.create({ name, author, description, price, image });

        res.status(201).json({ message: "New book created successfully", book: newBook });
    } catch (error) {
        console.error("Error creating new book:", error);
        res.status(500).json({ message: "Failed to create new book" });
    }
});

app.get('/getnewbook', async (req, res) => {
    try {
        const books = await newbookModel.find();

        res.status(200).json({ books });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Failed to fetch books" });
    }
});
// Assuming you have an endpoint to retrieve a book by its ID
app.get('/newupdatebook/:id', async (req, res) => {
    try {
        const book = await newbookModel.findById(req.params.id); // Using findById to find by ID

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book retrieved successfully", book });
    } catch (error) {
        console.error("Error retrieving book:", error);
        res.status(500).json({ message: "Failed to retrieve book" });
    }
});
// Route to update a book
app.put('/updatenewbook/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, author, description, price } = req.body;

        // Check if a new image file is uploaded
        let image;
        if (req.file) {
            image = req.file.filename;
        } else {
            // If no new image file is uploaded, retain the existing image filename
            const existingBook = await newbookModel.findById(req.params.id);
            if (!existingBook) {
                return res.status(404).json({ message: "Book not found" });
            }
            image = existingBook.image;
        }

        const updatedBook = await newbookModel.findByIdAndUpdate(
            req.params.id,
            { name, description, author, price, image },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Failed to update book" });
    }
});


app.delete('/deletenewbook/:id', async (req, res) => {
    try {
        const deletedBook = await newbookModel.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Failed to delete book" });
    }
});


///INTERNATIONAL BOOK
app.post('/postinterbook', upload.single('image'), async (req, res) => {
    try {
        const { name, author, description, price } = req.body;
        const image = req.file.filename; // Get filename of uploaded image

        const interBook = await InterModel.create({ name, author, description, price, image });

        res.status(201).json({ message: "New book created successfully", book: interBook });
    } catch (error) {
        console.error("Error creating new book:", error);
        res.status(500).json({ message: "Failed to create new book" });
    }
});

app.get('/getinterbook', async (req, res) => {
    try {
        const interbook = await InterModel.find();
        res.status(200).json({ interbook });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Failed to fetch books" });
    }
});
app.get('/interupdatebook/:id', async (req, res) => {
    try {
        const interbook = await InterModel.findById(req.params.id); // Using findById to find by ID

        if (!interbook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ interbook }); // Returning interbook instead of book
    } catch (error) {
        console.error("Error retrieving book:", error);
        res.status(500).json({ message: "Failed to retrieve book" });
    }
});


app.put('/updateinterbook/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, author, description, price } = req.body;

        // Check if a new image file is uploaded
        let image;
        if (req.file) {
            image = req.file.filename;
        } else {
            // If no new image file is uploaded, retain the existing image filename
            const existinginterBook = await InterModel.findById(req.params.id);
            if (!existinginterBook) {
                return res.status(404).json({ message: "Book not found" });
            }
            image = existinginterBook.image;
        }

        const updatedinterBook = await InterModel.findByIdAndUpdate(
            req.params.id,
            { name, description, author, price, image },
            { new: true }
        );

        if (!updatedinterBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully", book: updatedinterBook });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Failed to update book" });
    }
});


app.delete('/deleteinterbook/:id', async (req, res) => {
    try {
        const deletedinterBook = await InterModel.findByIdAndDelete(req.params.id);

        if (!deletedinterBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully", book: deletedinterBook });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Failed to delete book" });
    }
});

//BEST SELLER
app.post('/bestsellerbook', upload.single('image'), async (req, res) => {
    try {
        const { name, author, description, price } = req.body;
        const image = req.file.filename; // Get filename of uploaded image

        const bestsellerBook = await bestsellerModel.create({ name, author, description, price, image });

        res.status(201).json({ message: "New book created successfully", book: bestsellerBook });
    } catch (error) {
        console.error("Error creating new book:", error);
        res.status(500).json({ message: "Failed to create new book" });
    }
});

app.get('/bestsellerbook', async (req, res) => {
    try {
        const bestsellerbook = await bestsellerModel.find();
        res.status(200).json({ bestsellerbook });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Failed to fetch books" });
    }
});
app.get('/bestupdatebook/:id', async (req, res) => {
    try {
        const bestBook = await bestsellerModel.findById(req.params.id); // Use consistent naming
        if (!bestBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ bestBook }); // Use consistent naming
    } catch (error) {
        console.error("Error retrieving book:", error);
        res.status(500).json({ message: "Failed to retrieve book" });
    }
});

app.put('/updatebestseller/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, author, description, price } = req.body; // Include rating field if necessary

        let image;
        if (req.file) {
            image = req.file.filename;
        } else {
            const existingBestBook = await bestsellerModel.findById(req.params.id);
            if (!existingBestBook) {
                return res.status(404).json({ message: "Book not found" });
            }
            image = existingBestBook.image;
        }

        const updatedBestBook = await bestsellerModel.findByIdAndUpdate(
            req.params.id,
            { name, description, author, price, image }, // Include rating field if necessary
            { new: true }
        );

        if (!updatedBestBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully", book: updatedBestBook });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Failed to update book" });
    }
});



app.delete('/deletebestseller/:id', async (req, res) => {
    try {
        const deletedbestseller = await bestsellerModel.findByIdAndDelete(req.params.id);

        if (!deletedbestseller) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully", book: deletedbestseller });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Failed to delete book" });
    }
});

//AWARDWINS
app.post('/postawardbook', upload.single('image'), async (req, res) => {
    try {
        const { name, author, description, price } = req.body;
        const image = req.file ? req.file.filename : null; // Get filename of uploaded image, if exists

        if (!name || !author || !description || !price || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const awardBook = await awardwinsModel.create({ name, author, description, price, image });

        res.status(201).json({ message: "New book created successfully", book: awardBook });
    } catch (error) {
        console.error("Error creating new book:", error);
        res.status(500).json({ message: "Failed to create new book" });
    }
});
app.get('/getawardbook', async (req, res) => {
    try {
        const awardbook = await awardwinsModel.find();
        res.status(200).json({ books: awardbook }); // Ensure response structure matches what frontend expects
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Failed to fetch books" });
    }
});

app.get('/awardupdatebook/:id', async (req, res) => {
    try {
        const awardbook = await awardwinsModel.findById(req.params.id); // Using findById to find by ID

        if (!awardbook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ book: awardbook }); // Correctly returning book
    } catch (error) {
        console.error("Error retrieving book:", error);
        res.status(500).json({ message: "Failed to retrieve book" });
    }
});

app.put('/updateawardbook/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, author, description, price } = req.body;

        // Check if a new image file is uploaded
        let image;
        if (req.file) {
            image = req.file.filename;
        } else {
            // If no new image file is uploaded, retain the existing image filename
            const existingawardBook = await awardwinsModel.findById(req.params.id);
            if (!existingawardBook) {
                return res.status(404).json({ message: "Book not found" });
            }
            image = existingawardBook.image;
        }

        const updatedawardBook = await awardwinsModel.findByIdAndUpdate(
            req.params.id,
            { name, description, author, price, image },
            { new: true }
        );

        if (!updatedawardBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully", book: updatedawardBook });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Failed to update book" });
    }
});
app.delete('/deleteawardbook/:id', async (req, res) => {
    try {
        const deletedawardBook = await awardwinsModel.findByIdAndDelete(req.params.id);

        if (!deletedawardBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully", book: deletedawardBook });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Failed to delete book" });
    }
});


//CART
// Post route to add items to the cart
app.post('/postcart/:id', upload.single('image'), async (req, res) => {
    try {
        console.log('File received:', req.file); // Log file details
        console.log('Request body:', req.body); // Log other form fields
        
        // Ensure user is fetched correctly
        const user = await authModel.findById(req.params.id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, author, description, price } = req.body;
        const image = req.file ? req.file.filename : null;

        // Ensure cart is initialized
        if (!user.cart) {
            user.cart = [];
        }

        // Push new book to cart
        user.cart.push({ name, author, description, price, image: image || null });

        // Save user with updated cart
        await user.save();

        res.status(201).json({ message: "Book added to cart successfully", book: { name, author, description, price, image } });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Failed to add book" });
    }
});

app.get('/getcart/:id', async (req, res) => {
    try {
        // Ensure user is fetched correctly
        const user = await authModel.findById(req.params.id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure cart is initialized
        if (!user.cart) {
            user.cart = [];
        }

        // Respond with cart items
        res.status(200).json(user.cart);
    } catch (err) {
        console.error('Error retrieving cart items:', err);
        res.status(500).json({ error: 'Failed to retrieve cart items' });
    }
});

app.delete('/deletecart/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const result = await cartModel.deleteOne({ _id: bookId });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Book removed from cart successfully' });
        } else {
            res.status(404).json({ message: 'Book not found in cart' });
        }
    } catch (error) {
        console.error('Error deleting book from cart:', error);
        res.status(500).json({ message: 'Failed to remove book from cart' });
    }
});



//FEEDBACK
app.post('/feedback', async (req, res) => {
    try {
        const { name, email, feedback } = req.body;
        const fdback = await fdModel.create({ name, email, feedback });
        res.status(201).json(fdback);  // Sending a 201 status for a successful creation
    } catch (err) {
        console.error(err);  // Use console.error for logging errors
        res.status(500).json({ error: 'An error occurred while saving feedback' });  // Sending a 500 status for server errors
    }
});

app.get('/getfeedback', async (req, res) => {
    try {
        const feedbackEntries = await fdModel.find();  // Fetch all feedback entries from the database
        res.status(200).json(feedbackEntries);  // Sending a 200 status for a successful retrieval
    } catch (err) {
        console.error(err);  // Use console.error for logging errors
        res.status(500).json({ error: 'An error occurred while fetching feedback' });  // Sending a 500 status for server errors
    }
});

//PAYMENT
app.post('/payment', async (req, res) => {
    const { name, email, address, productname, price, debitCardNumber, expiryDate, cvv } = req.body;

    // Validate required fields
    if (!name || !email || !address || !productname || !price || !debitCardNumber || !expiryDate || !cvv) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Simulating payment processing logic
        const ordered = await paymentModel.create(req.body);
        console.log('Processing payment for:', name);
        res.json({ message: 'Payment successful!', ordered });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ message: 'Payment failed!', error: error.message });
    }
});
app.get('/ordered', async (req, res) => {
    try {
        const orders = await paymentModel.find();
        res.status(200).json(orders); // Corrected syntax
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving orders', error: err.message });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

//payment
app.post('/paypal/create-order', async (req, res) => {
    const { price, name, email, address, productName } = req.body;
  
    try {
      const accessToken = await getPayPalAccessToken();
      const response = await axios.post(
        `${PAYPAL_BASE_URL}/v2/checkout/orders`,
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: price,
              },
              description: productName,
            },
          ],
          payer: {
            name: {
              given_name: name,
            },
            email_address: email,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      res.json({ orderId: response.data.id });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).send('Failed to create PayPal order.');
    }
  });
  
  
  app.post('/payment/paypal', async (req, res) => {
    const { paypalOrderId } = req.body;
  
    try {
      const accessToken = await getPayPalAccessToken();
      const response = await axios.post(
        `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      res.json({ success: true, order: response.data });
    } catch (error) {
      console.error('Payment failed:', error);
      res.status(500).send('Failed to capture PayPal payment.');
    }
  });
  
  const getPayPalAccessToken = async () => {
    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: {
          username: PAYPAL_CLIENT_ID,
          password: PAYPAL_CLIENT_SECRET,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  
    return response.data.access_token;
  };
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
