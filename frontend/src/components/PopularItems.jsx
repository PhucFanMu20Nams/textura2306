import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PopularItems.css';

function PopularItems() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from the backend
    fetch('http://localhost:5000/api/products?limit=6')
      .then(response => response.json())
      .then(data => {
        console.log('Products data:', data);
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
        
        // Fallback to sample data if API fails
        setProducts(sampleProducts);
      });
  }, []);

  // Sample product data as fallback
  const sampleProducts = [
    {
      id: "lightweight-linen-shirt",
      name: 'Lightweight Linen Shirt',
      brand: 'Polo Ralph Lauren',
      price: '500.000 VND',
      image: '/assets/images/ralph_product.jpg'
    },
    {
      id: 2,
      name: 'Luxury Jersey Quarter-Zip Pullover',
      brand: 'Polo Ralph Lauren',
      price: '500.000 VND',
      image: '/assets/images/ralph_product.jpg'
    },
    {
      id: 3,
      name: 'Luxury Jersey Quarter-Zip Pullover',
      brand: 'Polo Ralph Lauren',
      price: '500.000 VND',
      image: '/assets/images/ralph_product.jpg'
    },
    {
      id: 4,
      name: 'Luxury Jersey Quarter-Zip Pullover',
      brand: 'Polo Ralph Lauren',
      price: '500.000 VND',
      image: '/assets/images/ralph_product.jpg'
    },
    {
      id: 5,
      name: 'Luxury Jersey Quarter-Zip Pullover',
      brand: 'Polo Ralph Lauren',
      price: '500.000 VND',
      image: '/assets/images/ralph_product.jpg'
    },
    {
      id: 6,
      name: 'Luxury Jersey Quarter-Zip Pullover',
      brand: 'Polo Ralph Lauren',
      price: '500.000 VND',
      image: '/assets/images/ralph_product.jpg'
    }
  ];

  // Helper function to handle image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/images/ralph_product.jpg'; // Default
    
    if (imagePath.startsWith('http')) return imagePath;
    
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://localhost:5000${path}`;
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  const displayProducts = products.length > 0 ? products : sampleProducts;

  return (
    <section className="popular-items">
      <div className="container">
        <h2 className="section-title">POPULAR ITEMS</h2>
        <p className="section-subtitle">Top-Selling Pieces from Last Month</p>
        
        <div className="products-grid">
          {displayProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={getImageUrl(product.image)} 
                  alt={product.name}
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.src = '/assets/images/ralph_product.jpg'; // Fallback
                  }}
                />
              </div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-brand">{product.brand}</p>
              <p className="product-price">{
                typeof product.price === 'number' 
                  ? product.price.toLocaleString() + ' VND' 
                  : product.price
              }</p>
            </Link>
          ))}
        </div>
        
        <div className="shop-now-container">
          <button className="shop-now-btn">SHOP NOW</button>
        </div>
      </div>
    </section>
  );
}

export default PopularItems;