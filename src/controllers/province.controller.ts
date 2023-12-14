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

export const addOneProvince = async (req: Request, res: Response) => {
  const { regionId, province_name } = req.body;

  try {
    if (!regionId || !province_name) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Region ID or Province Name is Required"
      });
    }

    const province = await prisma.province.create({
      data: {
        regionId: regionId,
        province_name: province_name,
        province_name_slug: slugLib(province_name)
      }
    });

    return res.status(201).json({
      status: "Success",
      statusCode: 201,
      message: "Success Add New Province",
      data: province
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in addOneProvince Controller ${error.message}`
    });
  }
}

export const updateProvince = async (req: Request, res: Response) => {
  const { regionId, province_name } = req.body;
  const { slug } = req.params;

  try {
    if (!regionId || !province_name) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Region ID and Province Name is Required"
      });
    }

    const province = await prisma.province.findFirst({
      where: {
        province_name_slug: slug
      }
    });

    if (!province) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Province Not Found!"
      });
    }

    const update = await prisma.province.update({
      where: {
        province_name_slug: slug,
        id: province.id
      },
      data: {
        regionId: regionId || province.regionId,
        province_name: province_name || province.province_name,
        province_name_slug: slugLib(province_name) || province.province_name_slug
      }
    });

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Success Update Province!",
      data: update
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in updateProvince Controller ${error.message}`
    });
  }
}

export const detailProvince = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const province = await prisma.province.findFirst({
      where: {
        province_name_slug: slug
      },
      include: {
        foods: true,
        Region: true
      }
    });

    if (!province) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Province Not Found!"
      });
    }

    return res.status(200).json({
      status: "Failed",
      statusCode: 200,
      message: "Data Province Found!",
      data: province
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in detailProvince Controller ${error.message}`
    });
  }
};

export const deleteProvince = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const province = await prisma.province.findFirst({
      where: {
        province_name_slug: slug
      }
    });

    if (!province) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Province Not Found!"
      });
    }

    await prisma.province.delete({
      where: {
        province_name_slug: slug,
        id: province.id
      }
    });

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Success Delete Province"
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in deleteProvince Controller ${error.message}`
    });
  }
};

export const provinceListRecipes = async (req: Request, res: Response) => {
  const { from } = req.query;
  
  try {
    const recipes = await prisma.province.findFirst({
      where: {
        province_name: {
          contains: String(from),
          mode: 'insensitive'
        }
      },
      include: {
        foods: true
      }
    });

    if (!recipes) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Province Not Found!"
      });
    }

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "List Food Recipe",
      data: recipes.foods.length < 1 ? `Sorry, Recipes From "${from}" Province Are Not Yet Available!` : recipes.foods
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in provinceListRecipes Controller ${error.message}`
    });
  }
};