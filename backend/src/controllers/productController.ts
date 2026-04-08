import { Request, Response } from 'express';
import Product from '../models/productModel';
import User from '../models/userModel';
import Tip from '../models/tipModel';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// Get all products with optional filters
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, minEcoScore, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (category) {
      const cat = String(category);
      filter.category = { $regex: new RegExp(`^${escapeRegex(cat)}$`, 'i') };
    }
    if (minEcoScore) {
      filter.ecoScore = { $gte: parseInt(String(minEcoScore), 10) };
    }
    if (search) {
      filter.name = { $regex: escapeRegex(String(search)), $options: 'i' };
    }

    const products = await Product.find(filter).sort({ ecoScore: -1 });
    res.json(products);
  } catch (error) {
    console.error('GET PRODUCTS ERROR:', error);
    res.status(500).json({
      message: 'Error fetching products',
      error: getErrorMessage(error),
    });
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
    res.status(500).json({
      message: 'Error fetching product',
      error: getErrorMessage(error),
    });
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

    user.purchasedProducts.push({
      productId: product._id,
      purchaseDate: new Date(),
      quantity: quantity || 1,
    });

    let totalPoints = 0;
    for (const purchase of user.purchasedProducts) {
      const prod = await Product.findById(purchase.productId);
      if (prod) {
        totalPoints += prod.ecoScore * purchase.quantity;
      }
    }

    const count = user.purchasedProducts.length;
    user.ecoScore =
      count > 0 ? Math.min(100, Math.floor(totalPoints / count)) : user.ecoScore;

    await user.save();

    res.json({
      message: 'Purchase added successfully',
      ecoScore: user.ecoScore,
      purchasedProducts: user.purchasedProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding purchase',
      error: getErrorMessage(error),
    });
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
      purchaseHistory: user.purchasedProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching eco-score',
      error: getErrorMessage(error),
    });
  }
};

// Get all tips
export const getTips = async (req: Request, res: Response): Promise<void> => {
  try {
    const tips = await Tip.find();
    res.json(tips);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching tips',
      error: getErrorMessage(error),
    });
  }
};
