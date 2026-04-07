// backend/src/controllers/productController.ts
import { Request, Response } from 'express';
import Product from '../models/productModel';
import User from '../models/userModel';
import Tip from '../models/tipModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sustainable_secret_key';

// Get all products with optional filters
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, minEcoScore, search } = req.query;
    let filter: any = {};
    
    if (category) filter.category = category;
    if (minEcoScore) filter.ecoScore = { $gte: parseInt(minEcoScore as string) };
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const products = await Product.find(filter).sort({ ecoScore: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get single product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// User signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      purchasedProducts: [],
      ecoScore: 0
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, username, email, ecoScore: 0 } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// User login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        ecoScore: user.ecoScore,
        purchasedProducts: user.purchasedProducts
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Add purchased product and update eco-score
export const addPurchase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId, quantity } = req.body;
    
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    
    if (!user || !product) {
      res.status(404).json({ message: 'User or product not found' });
      return;
    }
    
    // Add purchase to user's history
    user.purchasedProducts.push({
      productId: product._id,
      purchaseDate: new Date(),
      quantity: quantity || 1
    });
    
    // Calculate new eco-score based on product's ecoScore
    // Eco-score improves with sustainable purchases
    const totalEcoPoints = user.purchasedProducts.reduce(async (acc, purchase) => {
      const prod = await Product.findById(purchase.productId);
      return (await acc) + (prod ? prod.ecoScore * purchase.quantity : 0);
    }, Promise.resolve(0));
    
    user.ecoScore = Math.min(100, Math.floor(await totalEcoPoints / user.purchasedProducts.length));
    
    await user.save();
    
    res.json({ message: 'Purchase added successfully', ecoScore: user.ecoScore, purchasedProducts: user.purchasedProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error adding purchase', error });
  }
};

// Get user's eco-score and purchase history
export const getUserEcoScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId).populate('purchasedProducts.productId');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json({
      ecoScore: user.ecoScore,
      totalPurchases: user.purchasedProducts.length,
      purchaseHistory: user.purchasedProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching eco-score', error });
  }
};

// Get all tips
export const getTips = async (req: Request, res: Response): Promise<void> => {
  try {
    const tips = await Tip.find();
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tips', error });
  }
};