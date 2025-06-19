import{ Request, Response} from 'express';
import {
  ArrayNotEmpty,
  validateOrReject,
  IsEnum
} from 'class-validator';
import 'reflect-metadata';
import { plainToClass } from 'class-transformer';

import   ee  from '@google/earthengine'
import type { HttpFunction } from '@google-cloud/functions-framework';

import { eeAuthenticate, eeEvaluate } from './utils';
import { FeatureCollection } from './FeatureCollection';

import { NetChangeCalculations } from './calculations/NetChange';
import { HabitatExtentCalculations } from './calculations/HabitatExtent';
import { TreeHeightCalculations } from './calculations/TreeHeight';
import { BiomassCalculations } from './calculations/AbovegroundBiomass';
import { BlueCarbonCalculations } from './calculations/BlueCarbon';

enum Widgets {
  "mangrove_extent"  = "mangrove_extent",
  "mangrove_net_change"  = "mangrove_net_change",
  "mangrove_height"  = "mangrove_height",
  "mangrove_biomass"  = "mangrove_biomass",
  "mangrove_blue_carbon"  = "mangrove_blue_carbon"
}

class AnalysisRequestBody {
  geometry: FeatureCollection;
}
class AnalysisRequestParams {
  @ArrayNotEmpty()
  @IsEnum(Widgets, { each: true })
  widgets: Widgets[];
}

export const analyze: HttpFunction = async (req: Request, res: Response): Promise<Response> => {

  res.set('Access-Control-Allow-Origin', '*');
  const TEST_DICT = {
    "mangrove_extent": HabitatExtentCalculations,
    "mangrove_net_change": NetChangeCalculations,
    "mangrove_height": TreeHeightCalculations,
    "mangrove_biomass": BiomassCalculations,
    "mangrove_blue_carbon": BlueCarbonCalculations
  }
  const isValid = await validateInput(req, res);

  if (!isValid.status) {
    return isValid.res;
  }

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }

  try {

    await eeAuthenticate();

    const geometryCollection = ee.FeatureCollection(req.body.geometry);
    const widgets = req.query.widgets as Widgets[];
    const asyncRes = await Promise.all(widgets.map(async (i) => {
      const calculation = TEST_DICT[i];
      const result = await eeEvaluate(calculation.calculate(geometryCollection));
      return result;
    }));
    const response = widgets.reduce((accumulator, element, index) => {
      return {...accumulator, [element]: asyncRes[index]};
    }, {});

    res.status(200).json(response);

  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return res
}

async function validateInput(req: Request, res:  Response): Promise<{"status": Boolean, "res": Response}> {
  try {
    if (!req.body || !req.query) {
      return {"status": false,
            "res":  res.status(400).json({"error":"No data provided"})};
    }

    await validateOrReject(plainToClass(AnalysisRequestParams, req.query));
    await validateOrReject(plainToClass(AnalysisRequestBody, req.body));

    return {"status": true, "res": res};
  }
  catch (errors) {
    return {"status": false, "res": res.status(400).json({"error": errors})};
  }
}

