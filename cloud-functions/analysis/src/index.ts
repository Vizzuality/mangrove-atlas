import{ Request, Response} from 'express';
import {
  ArrayNotEmpty,
  validateOrReject,
  IsEnum
} from 'class-validator';
import 'reflect-metadata';
import { plainToClass } from 'class-transformer';

import   ee  from '@google/earthengine'
import type { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';

import { eeAuthenticate, eeEvaluate } from './utils';
import { FeatureCollection } from './FeatureCollection';

import { NetChangeCalculations } from './calculations/NetChange';
import { HabitatExtentCalculations } from './calculations/HabitatExtent';
import { TreeHeightCalculations } from './calculations/TreeHeight';
import { BiomassCalculations } from './calculations/AbovegroundBiomass';
import { BlueCarbonCalculations } from './calculations/BlueCarbon';

enum Widgets {
  "habitat-extent"  = "habitat-extent",
  "net-change"  = "net-change",
  "tree-height"  = "tree-height",
  "aboveground-biomass"  = "aboveground-biomass",
  "blue-carbon"  = "blue-carbon"
}

class AnalysisRequestBody {
  geometry: FeatureCollection;
}
class AnalysisRequestParams {
  @ArrayNotEmpty()
  @IsEnum(Widgets, { each: true })

  widgets: Widgets[];
}

export const analyze: HttpFunction = async (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');
  const TEST_DICT = {
    "habitat-extent": HabitatExtentCalculations,
    "net-change": NetChangeCalculations,
    "tree-height": TreeHeightCalculations,
    "aboveground-biomass": BiomassCalculations,
    "blue-carbon": BlueCarbonCalculations
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
    res.status(400).json({"error": error.message});
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

