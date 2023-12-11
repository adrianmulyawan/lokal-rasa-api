import { Request, Response } from "express";

import { PrismaClient } from '@prisma/client'

import slugLib from "slug";

const prisma = new PrismaClient();

export const showProvince = async (req:Request, res: Response) => {
  try {
    const provinces = await prisma.province.findMany({
      include: { 
        foods: true,
        Region: true
      }
    });

    if (provinces.length < 1) {
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Sorry, Provinces Data is Still Empty!"
      });
    }

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Data Provinces is Found!",
      data: provinces
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in showProvince Controller ${error.message}`
    });
  }
};

type Province = {
  regionId: number;
  province_name: string;
  province_nam_slug: string;
};

export const addManyProvinces = async (req: Request, res: Response) => {
  const provinceData = req.body;

  try {
    const formattedData: Province[] = provinceData.map((province: any) => ({
      regionId: province.regionId,
      province_name: province.province_name,
      province_name_slug: slugLib(province.province_name),
    }));

    const addProvinces = await prisma.province.createMany({
      data: formattedData
    });

    return res.status(201).json({
      status: "Success",
      statusCode: 201,
      message: "Success Add New Province",
      data: addProvinces
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in addManyProvince Controller ${error.message}`
    });
  }
};