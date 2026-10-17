/**
 * @file mockPlants.ts
 * @description Master plant catalogue combining partitioned collections.
 */

import { Product } from '../types/product';
import { MOCK_PLANTS_PART1 } from './mockPlantsPart1';
import { MOCK_PLANTS_PART2 } from './mockPlantsPart2';

export const MOCK_PLANTS: Product[] = [...MOCK_PLANTS_PART1, ...MOCK_PLANTS_PART2];
