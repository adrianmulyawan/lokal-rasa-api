import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import slugLib from "slug";

const prisma = new PrismaClient();

export const showAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        foods: true
      }
    });

    if (categories.length < 1) {
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Sorry, Categories Data is Still Empty!"
      });
    }

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Data Categories is Found!",
      data: categories
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in showAllCategories Controller ${error.message}`
    });
  }
};

export const addNewCategory = async (req: Request, res: Response) => {
  const { category_name } = req.body;

  try {
    if (!category_name) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Category Name is Required!"
      });
    }

    const category = await prisma.category.create({
      data: {
        category_name: category_name,
        category_name_slug: slugLib(category_name)
      }
    });

    return res.status(201).json({
      status: "Success",
      statusCode: 201,
      message: "Success Add New Category!",
      data: category
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in addNewCategory Controller ${error.message}`
    });
  }
};

export const findCategory = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const category = await prisma.category.findFirst({
      where: {
        category_name_slug: slug
      },
      include: {
        foods: true
      }
    });

    if (!category) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Category Not Found!"
      });
    }

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Category Found!",
      data: category
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in findCategory Controller ${error.message}`
    });
  }
};

export const editCategory = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { category_name } = req.body;

  try {
    if (!category_name) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Category Name is Required!"
      });
    }

    const category = await prisma.category.findFirst({
      where: {
        category_name_slug: slug
      }
    });

    if (!category) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Category Not Found!"
      });
    }

    const update = await prisma.category.update({
      where: {
        category_name_slug: slug,
        id: category.id
      },
      data: {
        category_name: category_name || category.category_name,
        category_name_slug: slugLib(category_name) || category.category_name_slug
      }
    });

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Success Update Category!",
      data: update
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in editCategory Controller ${error.message}`
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const category = await prisma.category.findFirst({
      where: {
        category_name_slug: slug
      }
    });

    if (!category) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Category Not Found!"
      });
    }

    await prisma.category.delete({
      where: {
        category_name_slug: slug,
        id: category.id
      }
    });

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Success Delete Category!"
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in deleteCategory Controller ${error.message}`
    });
  }
}