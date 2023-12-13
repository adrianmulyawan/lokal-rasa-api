import { Request, Response } from "express";
import slugLib from 'slug';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const showFoods = async (req: Request, res: Response) => {
  try {
    const foods = await prisma.food.findMany({
      include: { 
        Province: true,
        Category: true
      },
      skip: Number(req.query.skip),
      take: Number(req.query.take)
    });

    if (foods.length < 1) {
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Sorry, Foods Data is Still Empty!"
      });
    }

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Data Foods is Found!",
      data: foods
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in showFoods Controller ${error.message}`
    });
  }
};

export const addNewFood = async (req: Request, res: Response) => {
  const {
    provinceId, categoryId, food_name,
    description, cooking_time, number_of_servings,
    cooking_difficulty_level, url_video_recipe, source_recipe
  } = req.body;

  try {
    if (!provinceId || !categoryId || !food_name || !cooking_time || !number_of_servings || !cooking_difficulty_level || !source_recipe ) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Province ID, Category ID, Food Name, Cooking Time, Number of Servings, Cooking Difficulty Level, and Source Recipe is Required"
      });
    }

    const slugName = slugLib(food_name);
    const imageName = req.file?.filename;

    const food = await prisma.food.create({
      data: {
        provinceId: Number(provinceId),
        categoryId: Number(categoryId),
        image: String(imageName),
        food_name: food_name,
        food_name_slug: slugName,
        description: description,
        cooking_time: cooking_time,
        number_of_servings: Number(number_of_servings),
        cooking_difficulty_level: cooking_difficulty_level,
        url_video_recipe: url_video_recipe,
        source_recipe: source_recipe
      }
    });

    return res.status(201).json({
      status: "Success",
      statusCode: 201,
      message: "Success Add New Recipe",
      data: food
    });

    return res.status(200).json({
      data: req.body,
      imageUrl: req.file?.filename
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in addFood Controller ${error.message}`
    });
  }
}