/**
 * @file mockProducts.ts
 * @description Master mock catalogue combining plant and seed collections.
 */

import { Product } from '../types/product';
import { MOCK_PLANTS } from './mockPlants';
import { MOCK_SEEDS } from './mockSeeds';
import { MOCK_SUPPLIES } from './mockSupplies';

export const MOCK_PRODUCTS: Product[] = [...MOCK_PLANTS, ...MOCK_SEEDS, ...MOCK_SUPPLIES];

