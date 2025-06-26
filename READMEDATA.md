# Guide to Migrating from JSON Files to PostgreSQL in Express.js Application

## File Structure After Migration

```
textura-web-app/
├── frontend/                    # Existing React frontend (remains unchanged)
│   └── ...
├── backend/
│   ├── config/
│   │   └── db.config.js         # PostgreSQL configuration
│   ├── models/
│   │   ├── index.js             # Sequelize models initialization
│   │   ├── product.model.js     # Product model
│   │   ├── productDetail.model.js # Product details model
│   │   ├── productImage.model.js  # Product images model
│   │   └── productSize.model.js   # Product sizes model
│   ├── routes/
│   │   └── products.js          # Updated product routes
│   ├── utils/
│   │   └── dbInit.js            # Database initialization
│   ├── migrations/
│   │   └── migrate-json-to-db.js # Data migration script
│   ├── images/                  # Keep your existing image directory
│   │   └── products/            # Product images
│   ├── package.json             # Updated with PostgreSQL dependencies
│   └── server.js                # Updated server file
```

## Step 1: Install PostgreSQL

1. Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. During installation, set a password for the default 'postgres' user
3. After installation, create a database:

```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE textura_db;

# Verify the database was created
\l

# Exit PostgreSQL
\q
```

## Step 2: Install Required Dependencies

Open your terminal in the backend directory and install:

```bash
cd c:\Users\phucp\textura-web-app\texturea-web-app\backend
npm install pg pg-hstore sequelize dotenv
```

## Step 3: Create Environment Configuration

Create a `.env` file in the backend directory:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=textura_db
DB_PORT=5432
```

## Step 4: Set Up Database Configuration

```javascript
require('dotenv').config();

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "your_password_here",
  DB: process.env.DB_NAME || "textura_db",
  PORT: process.env.DB_PORT || 5432,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
```

## Step 5: Define Database Models

### Initialize Sequelize

```javascript
const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db.config.js");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.products = require("./product.model.js")(sequelize, Sequelize);
db.productDetails = require("./productDetail.model.js")(sequelize, Sequelize);
db.productImages = require("./productImage.model.js")(sequelize, Sequelize);
db.productSizes = require("./productSize.model.js")(sequelize, Sequelize);

// Define relationships
db.products.hasMany(db.productDetails, { as: "details", foreignKey: "productId" });
db.productDetails.belongsTo(db.products, { foreignKey: "productId" });

db.products.hasMany(db.productImages, { as: "gallery", foreignKey: "productId" });
db.productImages.belongsTo(db.products, { foreignKey: "productId" });

db.products.hasMany(db.productSizes, { as: "sizes", foreignKey: "productId" });
db.productSizes.belongsTo(db.products, { foreignKey: "productId" });

module.exports = db;
```

### Product Model

```javascript
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("product", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    timestamps: true
  });

  return Product;
};
```

### Product Details Model

```javascript
module.exports = (sequelize, DataTypes) => {
  const ProductDetail = sequelize.define("product_detail", {
    detail: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return ProductDetail;
};
```

### Product Image Model

```javascript
module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define("product_image", {
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return ProductImage;
};
```

### Product Size Model

```javascript
module.exports = (sequelize, DataTypes) => {
  const ProductSize = sequelize.define("product_size", {
    size: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return ProductSize;
};
```

## Step 6: Database Initialization Utility

```javascript
const db = require('../models');

const initializeDatabase = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models with database
    await db.sequelize.sync();
    console.log('Database synchronized successfully');
    
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = initializeDatabase;
```

## Step 7: Create Migration Script

```javascript
const fs = require('fs');
const path = require('path');
const db = require('../models');

const migrateData = async () => {
  try {
    // Read JSON file
    const jsonPath = path.join(__dirname, '../data/products.json');
    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Migration counters
    let productsCreated = 0;
    let detailsCreated = 0;
    let imagesCreated = 0;
    let sizesCreated = 0;

    // Process each product
    for (const productData of productsData) {
      // Create the product
      const product = await db.products.create({
        id: productData.id,
        name: productData.name,
        brand: productData.brand,
        price: productData.price,
        category: productData.category,
        subcategory: productData.subcategory,
        type: productData.type,
        image: productData.image
      });
      
      productsCreated++;

      // Create product details
      if (productData.details && productData.details.length > 0) {
        for (const detail of productData.details) {
          await db.productDetails.create({
            productId: product.id,
            detail: detail
          });
          detailsCreated++;
        }
      }

      // Create product images
      if (productData.gallery && productData.gallery.length > 0) {
        for (const imageUrl of productData.gallery) {
          await db.productImages.create({
            productId: product.id,
            imageUrl: imageUrl
          });
          imagesCreated++;
        }
      }

      // Create product sizes
      if (productData.sizes && productData.sizes.length > 0) {
        for (const size of productData.sizes) {
          await db.productSizes.create({
            productId: product.id,
            size: size
          });
          sizesCreated++;
        }
      }
    }

    console.log(`Migration complete: Created ${productsCreated} products, ${detailsCreated} details, ${imagesCreated} images, and ${sizesCreated} sizes.`);
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

// Execute migration if this file is run directly
if (require.main === module) {
  (async () => {
    try {
      // Sync database before migration
      await db.sequelize.sync({ force: true });
      console.log('Database synchronized. Beginning migration...');
      
      await migrateData();
      process.exit(0);
    } catch (error) {
      console.error('Migration script failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = migrateData;
```

## Step 8: Update Products Routes

```javascript
const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');

// Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    // Handle category filtering if provided
    const whereClause = {};
    if (req.query.category) {
      whereClause.category = req.query.category;
    }
    
    // Handle brand filtering
    if (req.query.brand) {
      whereClause.brand = req.query.brand;
    }
    
    // Handle price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      whereClause.price = {};
      if (req.query.minPrice) {
        whereClause.price[Op.gte] = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        whereClause.price[Op.lte] = parseInt(req.query.maxPrice);
      }
    }

    const { count, rows } = await db.products.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      include: [
        { model: db.productSizes, as: 'sizes', attributes: ['size'] }
      ]
    });

    // Transform the product data to match the JSON format the frontend expects
    const products = rows.map(product => {
      const productData = product.toJSON();
      
      // Extract sizes array to match previous format
      if (productData.sizes) {
        productData.sizes = productData.sizes.map(s => s.size);
      }
      
      return productData;
    });

    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await db.products.findByPk(req.params.id, {
      include: [
        { model: db.productDetails, as: 'details', attributes: ['detail'] },
        { model: db.productImages, as: 'gallery', attributes: ['imageUrl'] },
        { model: db.productSizes, as: 'sizes', attributes: ['size'] }
      ]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Transform to match the expected format
    const productData = product.toJSON();
    
    // Transform details array
    if (productData.details) {
      productData.details = productData.details.map(d => d.detail);
    }
    
    // Transform gallery array
    if (productData.gallery) {
      productData.gallery = productData.gallery.map(g => g.imageUrl);
    }
    
    // Transform sizes array
    if (productData.sizes) {
      productData.sizes = productData.sizes.map(s => s.size);
    }
    
    res.json(productData);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

module.exports = router;
```

## Step 9: Update Server.js

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const productRoutes = require('./routes/products');
const initializeDatabase = require('./utils/dbInit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", "*"],
    imgSrc: ["'self'", "*", "data:"]
  }
}));

app.use(helmet.crossOriginResourcePolicy({ 
  policy: "cross-origin" 
}));

app.use(compression());

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Serve static files (images)
app.use('/images', express.static(path.join(__dirname, 'images'), {
  setHeaders: function(res) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Timing-Allow-Origin', '*');
  }
}));

// API routes
app.use('/api/products', productRoutes);

// Initialize database before starting server
const startServer = async () => {
  const dbInitialized = await initializeDatabase();
  
  if (dbInitialized) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } else {
    console.error('Failed to initialize database. Server not started.');
    process.exit(1);
  }
};

startServer();
```

## Step 10: Update Package.json

```json
{
  "name": "textura-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "node migrations/migrate-json-to-db.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "compression": "^1.8.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^5.1.0",
    "helmet": "^8.1.0",
    "multer": "^2.0.1",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.35.1",
    "sharp": "^0.34.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Step 11: Run the Migration

```bash
# Navigate to backend directory
cd c:\Users\phucp\textura-web-app\texturea-web-app\backend

# Install new dependencies
npm install

# Run the migration script
npm run migrate
```

## Step 12: Start the Server

```bash
# Start the server
npm start
```

## Key Points to Note

1. **Database Schema**: We've created separate tables for products, details, images, and sizes to properly normalize the data.

2. **Data Consistency**: The API responses are transformed to match the original JSON format, so your React frontend will continue to work without changes.

3. **Improved Querying**: You can now use PostgreSQL's powerful querying features, including filtering by price ranges, categories, etc.

4. **Data Relationships**: The Sequelize ORM manages the relationships between your data models, making it easier to work with related data.

5. **Images Storage**: We're still serving images from the filesystem, which is a good approach. Only the product metadata is stored in PostgreSQL.

6. **Security**: The existing security measures (CORS, Helmet) are preserved in the new implementation.

With this implementation, your application is now using PostgreSQL instead of JSON files while maintaining compatibility with your existing frontend. This will provide better performance, scalability, and the ability to perform more complex queries as your application grows.

Similar code found with 1 license type

