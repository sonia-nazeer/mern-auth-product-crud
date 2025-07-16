const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const protect = require('../middleware/auth');

// POST /api/products - Create a new product
router.post('/products', protect, async (req, res) => {
  const { name, price, category } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newProduct = new Product({ name, price, category });
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product created', product: savedProduct });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products - Get all products (with optional filtering)
router.get('/products', async (req, res) => {
  const { category } = req.query;
  try {
    const query = category ? { category } : {};
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id - Get a single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/// PUT /api/products/:id - Update a product
router.put('/products/:id', rotect, async (req, res) => {
  const { name, price, category } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    // ✅ FIX: Return just the updated product
   
    res.status(200).json({ message: 'Product updated', product: updatedProduct }); // ✅ THIS IS CORRECT
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE /api/products/:id - Delete a product
router.delete('/products/:id', protect, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
