import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import Product from './models/productModel';
import Tip from './models/tipModel';
import User from './models/userModel';
import Actor from './models/actorModel';
import SupplyChainMovement from './models/supplyChainMovementModel';
import BlockchainLedgerEntry from './models/blockchainLedgerEntryModel';
import VerificationLog from './models/verificationLogModel';
import bcrypt from 'bcryptjs';
import { scoreMovementAnomaly } from './anomaly/anomalyDetector';
import { sha256ToBytes32Hex, stableStringify } from './utils/hash';
import { recordMovementOnChain } from './blockchain/blockchainService';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const products = [
  {
    name: 'Bamboo Toothbrush Set',
    description: 'Eco-friendly bamboo toothbrushes with biodegradable bristles. Pack of 4 brushes that help reduce plastic waste.',
    category: 'Home & Living',
    ecoScore: 92,
    imageUrl: '/images/bamboo-toothbrush.jpg',
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
    imageUrl: '/images/reusable-bags.jpg',
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
    imageUrl: '/images/solar-charger.jpg',
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
    imageUrl: '/images/organic-tshirt.jpg',
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
    imageUrl: '/images/steel-bottle.jpg',
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
    imageUrl: '/images/led-bulb.jpg',
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
    imageUrl: '/images/compost-bin.jpg',
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
    imageUrl: '/images/electric-bike.jpg',
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
    imageUrl: '/images/beeswax-wraps.jpg',
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
    imageUrl: '/images/cleaning-kit.jpg',
    price: 27.99,
    carbonFootprint: 1.8,
    waterUsage: 12,
    recyclable: true,
  },
  {
    name: 'Reusable Metal Straws',
    description: 'Set of 8 stainless steel straws with cleaning brushes and carry pouch. Ditch single-use plastic straws forever.',
    category: 'Waste Reduction',
    ecoScore: 89,
    imageUrl: '/images/reusable-straw.jpg',
    price: 9.99,
    carbonFootprint: 0.4,
    waterUsage: 3,
    recyclable: true,
  },
  {
    name: 'Eco-Friendly Notebook',
    description: 'Made from 100% recycled paper with soy-based ink. Tree-free, sustainable stationery for everyday use.',
    category: 'Home & Living',
    ecoScore: 86,
    imageUrl: '/images/eco-notebook.jpg',
    price: 8.99,
    carbonFootprint: 0.6,
    waterUsage: 7,
    recyclable: true,
  },
  {
    name: 'Organic Cotton Cloth Bag',
    description: 'Durable organic cotton tote bag for groceries and everyday carry. Replaces hundreds of plastic bags per year.',
    category: 'Waste Reduction',
    ecoScore: 87,
    imageUrl: '/images/cloth-bag.jpg',
    price: 11.99,
    carbonFootprint: 0.8,
    waterUsage: 15,
    recyclable: true,
  },
  {
    name: 'Bamboo Cutlery Set',
    description: 'Portable bamboo utensil set including fork, knife, spoon, and chopsticks in a cotton carry case.',
    category: 'Waste Reduction',
    ecoScore: 93,
    imageUrl: '/images/bamboo-cutlery.jpg',
    price: 14.99,
    carbonFootprint: 0.3,
    waterUsage: 4,
    recyclable: true,
  },
  {
    name: 'Natural Handmade Soap',
    description: 'Cold-pressed soap made with organic essential oils and natural ingredients. Zero plastic packaging.',
    category: 'Home & Living',
    ecoScore: 90,
    imageUrl: '/images/natural-soap.jpg',
    price: 7.99,
    carbonFootprint: 0.2,
    waterUsage: 6,
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
    // NOTE: SDG7 supply-chain data references Product records, so we clear it too
    // to avoid orphan movements/graphs after reseeding.
    await Product.deleteMany({});
    await Tip.deleteMany({});
    await SupplyChainMovement.deleteMany({});
    await BlockchainLedgerEntry.deleteMany({});
    await VerificationLog.deleteMany({});
    console.log('Cleared existing products, tips, and SDG7 supply-chain collections.');

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
        role: 'admin',
      });
      console.log('Created demo user (demo@ecolife.com / demo123).');
    } else {
      // Backfill role in case the user was created before the role field existed.
      if (!existingUser.role || existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        await existingUser.save();
      }
      console.log('Demo user already exists (ensured role=admin).');
    }

    // Seed actors for supply-chain transparency demo.
    // Admin/operator can use these actors to record movement events.
    const actorSeed = [
      { actorType: 'supplier' as const, name: 'GreenSource Materials', location: 'Port District' },
      { actorType: 'manufacturer' as const, name: 'EcoWeave Manufacturing', location: 'Industrial Park' },
      { actorType: 'distributor' as const, name: 'PlanetFast Distribution', location: 'Metro Hub' },
      { actorType: 'consumer' as const, name: 'EcoLife Community Buyers', location: 'Online' },
    ];

    const actors: Record<string, any> = {};
    for (const a of actorSeed) {
      const existing = await Actor.findOne({ actorType: a.actorType, name: a.name });
      if (!existing) {
        actors[a.actorType] = await Actor.create(a);
      } else {
        actors[a.actorType] = existing;
      }
    }

    // Seed a sample movement chain for the first product.
    // This helps validate supply-chain graph + blockchain verification endpoints.
    const firstProduct = await Product.findOne({});
    if (firstProduct) {
      const alreadySeeded = await SupplyChainMovement.exists({ productId: firstProduct._id });
      if (!alreadySeeded) {
        const movementId = new mongoose.Types.ObjectId();
        const movementUniqueKey = `${firstProduct._id.toString()}:${movementId.toString()}`;
        const occurredAt = new Date();

        const quantity = 10;
        const movementType = 'raw_material';

        const canonicalPayload = stableStringify({
          productId: firstProduct._id.toString(),
          movementUniqueKey,
          fromActorId: actors.supplier._id.toString(),
          toActorId: actors.manufacturer._id.toString(),
          quantity,
          movementType,
          notes: 'Seeded sample movement for SDG7 demo',
          occurredAt: occurredAt.toISOString(),
          evidenceUrl: null,
          evidenceHash: null,
        });

        const movementHash = sha256ToBytes32Hex(canonicalPayload);

        const anomaly = scoreMovementAnomaly({
          movement: {
            quantity,
            movementType,
            notes: 'Seeded sample movement for SDG7 demo',
            occurredAt,
            evidenceUrl: undefined,
            evidenceHash: undefined,
          },
          fromActorType: actors.supplier.actorType,
          toActorType: actors.manufacturer.actorType,
          previousMovementsForProduct: [],
        });

        const movement = await SupplyChainMovement.create({
          _id: movementId,
          productId: firstProduct._id,
          fromActorId: actors.supplier._id,
          toActorId: actors.manufacturer._id,

          quantity,
          movementType,
          notes: 'Seeded sample movement for SDG7 demo',
          occurredAt,
          movementUniqueKey,
          movementHash,

          evidenceUrl: undefined,
          evidenceHash: undefined,

          anomalyScore: anomaly.anomalyScore,
          anomalyReasons: anomaly.anomalyReasons,
          anomalyFlagged: anomaly.anomalyFlagged,
          needsReview: anomaly.needsReview,

          isVerifiedOnChain: false,
        });

        const onChain = await recordMovementOnChain({
          uniqueKey: movementUniqueKey,
          movementHash,
        });

        movement.blockchainTxHash = onChain.txHash;
        movement.blockchainBlockNumber = onChain.blockNumber;
        movement.isVerifiedOnChain = onChain.onChainVerified;
        await movement.save();

        await BlockchainLedgerEntry.create({
          movementId: movement._id,
          productId: firstProduct._id,
          movementUniqueKey,
          movementHash,
          txHash: movement.blockchainTxHash || onChain.txHash,
          blockNumber: movement.blockchainBlockNumber,
        });

        console.log('Seeded sample supply-chain movement (SDG7).');
      }
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
