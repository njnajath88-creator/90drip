const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Temporary static data until DB is populated
const products = [
  {
    id: 1,
    name: 'FC Barcelona #10 Home',
    sport: 'Football',
    price: 89.99,
    originalPrice: 119.99,
    image: '/images/jersey_product1.png',
    badges: ['New'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    name: 'Classic #7 Red',
    sport: 'Football',
    price: 74.99,
    originalPrice: null,
    image: '/images/jersey_product2.png',
    badges: ['Sale'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 3,
    name: 'City FC #9 Blue',
    sport: 'Football',
    price: 79.99,
    originalPrice: 99.99,
    image: '/images/jersey_product3.png',
    badges: ['New'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 4,
    name: 'Green Eagle #11',
    sport: 'Football',
    price: 69.99,
    originalPrice: null,
    image: '/images/jersey_product4.png',
    badges: [],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
