const fs = require('fs');
const path = require('path');
const db = require('../models');

async function migrateData() {
  try {
    // Read JSON file
    const jsonPath = path.join(__dirname, '../data/products.json');
    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log(`Found ${productsData.length} products in JSON file`);

    // Process each product
    for (const product of productsData) {
      // Create product record
      console.log(`Migrating product: ${product.id}`);
      
      const [productRecord] = await db.products.findOrCreate({
        where: { id: product.id },
        defaults: {
          name: product.name,
          brand: product.brand,
          price: product.price,
          category: product.category,
          subcategory: product.subcategory,
          type: product.type,
          image: product.image
        }
      });

      // Add details
      if (product.details && Array.isArray(product.details)) {
        for (const detail of product.details) {
          await db.productDetails.findOrCreate({
            where: {
              productId: product.id,
              detail: detail
            },
            defaults: {
              productId: product.id,
              detail: detail
            }
          });
        }
      }

      // Add gallery images
      if (product.gallery && Array.isArray(product.gallery)) {
        for (const imageUrl of product.gallery) {
          await db.productImages.findOrCreate({
            where: {
              productId: product.id,
              imageUrl: imageUrl
            },
            defaults: {
              productId: product.id,
              imageUrl: imageUrl
            }
          });
        }
      }

      // Add sizes
      if (product.sizes && Array.isArray(product.sizes)) {
        for (const size of product.sizes) {
          await db.productSizes.findOrCreate({
            where: {
              productId: product.id,
              size: size
            },
            defaults: {
              productId: product.id,
              size: size
            }
          });
        }
      }
    }

    console.log('Data migration completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

// Execute the migration if this file is run directly
if (require.main === module) {
  (async () => {
    try {
      // Sync tables
      await db.sequelize.sync();
      console.log('Database synchronized');
      
      // Run migration
      await migrateData();
      console.log('Migration completed');
      process.exit(0);
    } catch (error) {
      console.error('Migration script failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = migrateData;