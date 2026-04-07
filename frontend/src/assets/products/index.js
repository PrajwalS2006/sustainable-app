// frontend/src/assets/products/index.js
// Local product image mapping
import bambooToothbrush from './bamboo-toothbrush.jpg';
import reusableBags from './reusable-bags.jpg';
import solarCharger from './solar-charger.jpg';
import organicTshirt from './organic-tshirt.jpg';
import steelBottle from './steel-bottle.jpg';
import ledBulb from './led-bulb.jpg';
import compostBin from './compost-bin.jpg';
import electricBike from './electric-bike.jpg';
import beeswaxWraps from './beeswax-wraps.jpg';
import cleaningKit from './cleaning-kit.jpg';
import reusableStraw from './reusable-straw.jpg';
import ecoNotebook from './eco-notebook.jpg';
import clothBag from './cloth-bag.jpg';
import bambooCutlery from './bamboo-cutlery.jpg';
import naturalSoap from './natural-soap.jpg';

// Map product names to local images
const productImages = {
  'Bamboo Toothbrush Set': bambooToothbrush,
  'Reusable Shopping Bags': reusableBags,
  'Solar Power Bank': solarCharger,
  'Organic Cotton T-Shirt': organicTshirt,
  'Stainless Steel Water Bottle': steelBottle,
  'LED Smart Bulb Pack': ledBulb,
  'Compost Bin': compostBin,
  'Electric Bike Rental Pass': electricBike,
  'Beeswax Food Wraps': beeswaxWraps,
  'Plant-Based Cleaning Kit': cleaningKit,
  'Reusable Metal Straws': reusableStraw,
  'Eco-Friendly Notebook': ecoNotebook,
  'Organic Cotton Cloth Bag': clothBag,
  'Bamboo Cutlery Set': bambooCutlery,
  'Natural Handmade Soap': naturalSoap,
};

export const getProductImage = (productName) => {
  return productImages[productName] || null;
};

export default productImages;
