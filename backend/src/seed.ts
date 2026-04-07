// backend/src/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel';
import Tip from './models/tipModel';
import User from './models/userModel';
import bcrypt from 'bcryptjs';

dotenv.config();

const products = [
  {
    name: 'Bamboo Toothbrush Set',
    description: 'Eco-friendly bamboo toothbrushes with biodegradable bristles. Pack of 4 brushes that help reduce plastic waste.',
    category: 'Home & Living',
    ecoScore: 92,
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400',
    price: 12.99,
    carbonFootprint: 0.5,
    waterUsage: 5,
    recyclable: true,
  },
  {
    name: 'Reusable Shopping Bags',
    description: 'Set of 5 durable, washable shopping bags made from recycled materials. Folds compactly for easy carrying.',
    category: 'Waste Reduction',
    ecoScore: 88,
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
    price: 15.99,
    carbonFootprint: 1.2,
    waterUsage: 10,
    recyclable: true,
  },
  {
    name: 'Solar Power Bank',
    description: 'Portable solar-powered charger with 20000mAh capacity. Charge your devices using renewable energy.',
    category: 'Energy',
    ecoScore: 85,
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400',
    price: 39.99,
    carbonFootprint: 3.0,
    waterUsage: 15,
    recyclable: true,
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainably made t-shirt from 100% organic cotton. Fair trade certified with minimal environmental impact.',
    category: 'Fashion',
    ecoScore: 78,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    price: 29.99,
    carbonFootprint: 2.5,
    waterUsage: 25,
    recyclable: true,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-walled insulated bottle that keeps drinks cold for 24h or hot for 12h. Replaces 167 plastic bottles per year.',
    category: 'Waste Reduction',
    ecoScore: 90,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    price: 24.99,
    carbonFootprint: 1.0,
    waterUsage: 8,
    recyclable: true,
  },
  {
    name: 'LED Smart Bulb Pack',
    description: 'Energy-efficient smart LED bulbs. Uses 80% less energy than traditional bulbs. Pack of 4.',
    category: 'Energy',
    ecoScore: 82,
    imageUrl: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=400',
    price: 19.99,
    carbonFootprint: 1.5,
    waterUsage: 3,
    recyclable: true,
  },
  {
    name: 'Compost Bin',
    description: 'Kitchen countertop compost bin with charcoal filter. Turn food waste into nutrient-rich soil.',
    category: 'Home & Living',
    ecoScore: 87,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    price: 34.99,
    carbonFootprint: 2.0,
    waterUsage: 5,
    recyclable: true,
  },
  {
    name: 'Electric Bike Rental Pass',
    description: 'Monthly pass for electric bike sharing. Zero emissions urban transportation alternative.',
    category: 'Transport',
    ecoScore: 95,
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
    price: 49.99,
    carbonFootprint: 0.2,
    waterUsage: 1,
    recyclable: false,
  },
  {
    name: 'Beeswax Food Wraps',
    description: 'Reusable beeswax wraps to replace plastic cling film. Set of 3 sizes for all your food storage needs.',
    category: 'Waste Reduction',
    ecoScore: 91,
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400',
    price: 18.99,
    carbonFootprint: 0.3,
    waterUsage: 4,
    recyclable: true,
  },
  {
    name: 'Plant-Based Cleaning Kit',
    description: 'Complete home cleaning set made from plant-derived ingredients. Non-toxic and biodegradable.',
    category: 'Home & Living',
    ecoScore: 84,
    imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
    price: 27.99,
    carbonFootprint: 1.8,
    waterUsage: 12,
    recyclable: true,
  },
];

const tips = [
  { tipText: 'Carry a reusable water bottle to cut down on single-use plastic waste.', category: 'Waste Reduction' },
  { tipText: 'Switch to LED bulbs to save up to 80% on lighting energy costs.', category: 'Energy' },
  { tipText: 'Use public transport or bike instead of driving to reduce your carbon footprint.', category: 'Transport' },
  { tipText: 'Start composting food scraps to reduce landfill waste and enrich your soil.', category: 'Home & Living' },
  { tipText: 'Buy locally-sourced produce to support local farmers and reduce transport emissions.', category: 'Food' },
  { tipText: 'Choose clothing made from organic or recycled materials when shopping.', category: 'Fashion' },
  { tipText: 'Unplug electronics when not in use to save phantom energy consumption.', category: 'Energy' },
  { tipText: 'Use a reusable shopping bag every time you go to the store.', category: 'Waste Reduction' },
  { tipText: 'Take shorter showers to conserve water — aim for 5 minutes or less.', category: 'Home & Living' },
  { tipText: 'Repair items instead of replacing them to extend their lifecycle.', category: 'Waste Reduction' },
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sustainable_app';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await Tip.deleteMany({});
    console.log('Cleared existing products and tips.');

    // Seed products
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products.`);

    // Seed tips
    await Tip.insertMany(tips);
    console.log(`Seeded ${tips.length} tips.`);

    // Create demo user if not exists
    const existingUser = await User.findOne({ email: 'demo@ecolife.com' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      await User.create({
        username: 'demo',
        email: 'demo@ecolife.com',
        password: hashedPassword,
        purchasedProducts: [],
        ecoScore: 0,
      });
      console.log('Created demo user (demo@ecolife.com / demo123).');
    } else {
      console.log('Demo user already exists.');
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
