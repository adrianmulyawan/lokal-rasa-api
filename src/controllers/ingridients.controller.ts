import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Ingredients = {
  foodId: number,
  dose_ingredient: number,
  ingredient_name: string
};

export const showIngridients = async (req: Request, res: Response) => {
  const { recipe } = req.query;

  try {
    const findRecipe = await prisma.food.findFirst({
      where: {
        food_name: {
          contains: String(recipe),
          mode: 'insensitive'
        }
      },
      include: {
        ingredients: true
      }
    });

    if (!findRecipe) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Recipe Not Found!",
      });
    }

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "List Food Recipe",
      data: findRecipe.ingredients.length < 1 ? `Sorry, Recipes From "${recipe}" Province Are Not Yet Available!` : findRecipe.ingredients
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in showIngridients Controller ${error.message}`
    });
  }
};

export const addIngridients = async (req: Request, res: Response) => {
  const ingridientsData = req.body;

  try {
    if (!ingridientsData) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Food ID, Dose Ingridient, and Name Ingredients is Required!"
      });
    }

    const formattedData: Ingredients[] = ingridientsData.map((ingridient: any) => ({
      foodId: ingridient.foodId,
      dose_ingredient: Number(ingridient.dose_ingredient),
      ingredient_name: ingridient.ingredient_name
    }));

    const addIngridients = await prisma.ingredient.createMany({
      data: formattedData,
    });

    return res.status(201).json({
      status: "Success",
      statusCode: 201,
      message: "Success Add New Ingridients",
      data: addIngridients
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in addIngridients Controller ${error.message}`
    });
  }
};

export const addSingleIngridients = async (req: Request, res: Response) => {
  const { foodId, dose_ingredient, ingredient_name } = req.body;

  try {
    if (!foodId || !dose_ingredient || !ingredient_name) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Food ID, Dose Ingridient, and Ingridient Name is Required!"
      });
    }

    const addData = await prisma.ingredient.create({
      data: {
        foodId: Number(foodId),
        dose_ingredient: dose_ingredient,
        ingredient_name: ingredient_name
      }
    });

    return res.status(201).json({
      status: "Success",
      statusCode: 201,
      message: "Success Add Igridients",
      data: addData
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in addSingleIngridients Controller ${error.message}`
    });
  }
};

export const editIngridients = async (req: Request, res: Response) => {
  const { foodId, dose_ingredient, ingredient_name } = req.body;
  const { id } = req.params;

  try {
    const data = await prisma.ingredient.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!data) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Ingridient is Not Found!"
      });
    }

    const updateData = await prisma.ingredient.update({
      where: {
        id: Number(data.id)
      },
      data: {
        foodId: foodId || data.foodId,
        dose_ingredient: dose_ingredient || data.dose_ingredient,
        ingredient_name: ingredient_name || data.ingredient_name
      }
    });

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Success Update Ingridient",
      data: updateData
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in editIngridients Controller ${error.message}`
    });
  }
};

export const deleteIngridient = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = await prisma.ingredient.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!data) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Ingridient is Not Found!"
      });
    }

    await prisma.ingredient.delete({
      where: {
        id: Number(data.id)
      }
    });

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: `Success Delete Ingridient "${data.dose_ingredient} ${data.ingredient_name}"`
    })

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in deleteIngridient Controller ${error.message}`
    });
  }
};