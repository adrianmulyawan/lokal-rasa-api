import { Request, Response } from "express";
import slugLib from 'slug';
import { PrismaClient } from "@prisma/client";
import fs from 'fs-extra';
import path from "path";

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

    if (!req.file) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Image is Required!"
      });
    }

    const slugName = slugLib(food_name);
    const imageName = req.file?.filename;

    const food = await prisma.food.create({
      data: {
        provinceId: Number(provinceId),
        categoryId: Number(categoryId),
        image: String(`images/${imageName}`),
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

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in addFood Controller ${error.message}`
    });
  }
};

export const showDetailFood = async (req: Request, res: Response) => {
  const { slug } = req.params;
  
  try {
    const foodRecipe = await prisma.food.findFirst({
      where: {
        food_name_slug: slug
      },
      include: {
        Province: true,
        ingredients: true,
        steps: true
      }
    });

    if (!foodRecipe) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Recipe Not Found!"
      });
    }

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Data Recipe Found!",
      data: foodRecipe
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in showDetailFood Controller ${error.message}`
    });
  }
};

export const findRecipe = async (req: Request, res: Response) => {
  const { recipe } = req.query;

  try {
    const recipes = await prisma.food.findMany({
      where: {
        food_name: {
          contains: String(recipe),
          mode: 'insensitive'
        }
      }
    });

    if (!recipes) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Recipe Not Found!"
      });
    }

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: `List of Recipes Contain With '${ recipe }'!`,
      data: recipes
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in findRecipe Controller ${error.message}`
    });
  }
};

export const updateFoodRecipe = async (req: Request, res: Response) => {
  const {
    provinceId, categoryId, food_name,
    description, cooking_time, number_of_servings,
    cooking_difficulty_level, url_video_recipe, source_recipe
  } = req.body;

  const { slug } = req.params;

  try {
    // if (!provinceId || !categoryId || !food_name || !cooking_time || !number_of_servings || !cooking_difficulty_level || !source_recipe ) {
    //   return res.status(400).json({
    //     status: "Failed",
    //     statusCode: 400,
    //     message: "Province ID, Category ID, Food Name, Cooking Time, Number of Servings, Cooking Difficulty Level, and Source Recipe is Required"
    //   });
    // }

    const recipe = await prisma.food.findFirst({
      where: {
        food_name_slug: slug
      }
    });

    if (!recipe) {
      return res.status(404).json({
        status: "Success",
        statusCode: 404,
        message: "Recipe Not Found!"
      });
    }

    const slugName = slugLib(food_name);
    const imageName = req.file?.filename;

    if (req.file === undefined) {
      const food = await prisma.food.update({
        where: {
          id: recipe.id
        },
        data: {
          provinceId: Number(provinceId) || recipe.provinceId,
          categoryId: Number(categoryId) || recipe.categoryId,
          image: recipe.image,
          food_name: food_name || recipe.food_name,
          food_name_slug: slugName || recipe.food_name_slug,
          description: description || recipe.description,
          cooking_time: cooking_time || recipe.cooking_time,
          number_of_servings: Number(number_of_servings) || recipe.number_of_servings,
          cooking_difficulty_level: cooking_difficulty_level || recipe.cooking_difficulty_level,
          url_video_recipe: url_video_recipe || recipe.url_video_recipe,
          source_recipe: source_recipe || recipe.source_recipe
        }
      });
  
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Success Update Recipe!",
        data: food
      });

    } else {
      // > Hapus foto
      await fs.unlink(path.join(`public/${recipe.image}`));

      const food = await prisma.food.update({
        where: {
          id: recipe.id
        },
        data: {
          provinceId: Number(provinceId) || recipe.provinceId,
          categoryId: Number(categoryId) || recipe.categoryId,
          image: String(`images/${imageName}`),
          food_name: food_name || recipe.food_name,
          food_name_slug: slugName || recipe.food_name_slug,
          description: description || recipe.description,
          cooking_time: cooking_time || recipe.cooking_time,
          number_of_servings: Number(number_of_servings) || recipe.number_of_servings,
          cooking_difficulty_level: cooking_difficulty_level || recipe.cooking_difficulty_level,
          url_video_recipe: url_video_recipe || recipe.url_video_recipe,
          source_recipe: source_recipe || recipe.source_recipe
        }
      });
  
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Success Update Recipe!",
        data: food
      });
    }

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in updateFoodRecipe Controller ${error.message}`
    });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const recipe = await prisma.food.findFirst({
      where: {
        food_name_slug: slug
      }
    });

    if (!recipe) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Recipe Not Found"
      });
    }

    // > Hapus foto
    await fs.unlink(path.join(`public/${recipe.image}`));

    await prisma.food.delete({
      where: {
        food_name_slug: slug,
        id: recipe.id
      }
    });

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: `Success Delete Recipe: ${recipe.food_name}`
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in updateFoodRecipe Controller ${error.message}`
    });
  }
}