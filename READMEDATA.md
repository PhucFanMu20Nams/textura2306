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

