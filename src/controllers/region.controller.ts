import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import slug from 'slug'

const prisma = new PrismaClient();

export const showRegion = async (req: Request, res: Response) => {
  try {
    const regions = await prisma.region.findMany({
      include: { provinces: true },
      skip: 0,
      take: 4,
      orderBy: {
        id: 'desc'
      }
    });

    if (regions.length < 1) {
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Sorry, Regions Data is Still Empty!"
      });
    }

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Data Region is Found!",
      data: regions
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in ${error.message}`
    });
  }
};

export const addNewRegion =async (req: Request, res: Response) => {
  const { region_name } = req.body;

  try {
    if (!region_name) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Region Name is Required!"
      });
    }
    
    const region = await prisma.region.create({
      data: {
        region_name: region_name,
        region_slug: slug(region_name)
      }
    });

    return res.status(201).json({
      status: "Success",
      statusCode: 201,
      message: "Success Add New Region!",
      data: region
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in ${error.message}`
    });
  }
};

export const showDetailRegion =async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    if (!slug) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Slug is Required!"
      });
    }

    const region = await prisma.region.findFirst({
      where: {
        region_slug: slug
      },
      include: { provinces: true }
    });

    if (!region) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Region is Not Found!"
      });
    }

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Region is Found!",
      data: region
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in ${error.message}`
    });
  }
}