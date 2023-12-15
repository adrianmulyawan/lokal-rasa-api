import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from 'fs-extra';
import path from "path";

const prisma = new PrismaClient();

type Steps = {
  foodId: number;
  step_desc: string;
  step_image: string;
};

export const uploadStep = async (req: Request, res: Response) => {
  const { foodId, step_desc } = req.body;
  const image = req.file;

  try {
    if (!req.file) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Image is Required!"
      });
    }

    // console.info(req.file?.filename, '=> my file');
    // console.info(req.body, '=> body')

    if (!foodId || !step_desc) {
      return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Food ID and Step Desc are Required!",
      });
    }

    const imageName = image?.filename;

    const addStep = await prisma.step.create({
      data: {
        foodId: Number(foodId),
        step_desc: String(step_desc),
        step_image: String(`images/${imageName}`),
      }
    });
    
    return res.status(201).json({
      status: "Success",
      statusCode: 201,
      message: "Success Add New Steps!",
      data: addStep,
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in uploadManyStep Controller ${error.message}`,
    });
  }
};

export const updateStep = async (req: Request, res: Response) => {
  const { foodId, step_desc } = req.body;
  const image = req.file;
  const { id } = req.params;

  try {
    const step = await prisma.step.findFirst({
      where: {
        id: Number(id)
      }
    });

    if (!step) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Step Not Found!"
      });
    }

    const imageName = image?.filename;

    const update = await prisma.step.update({
      where: {
        id: Number(step?.id)
      },
      data: {
        foodId: Number(foodId) || step.id,
        step_desc: step_desc || step.step_desc,
        step_image: String(`images/${imageName}`) || step.step_image,
      }
    });

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: "Success Update Steps!",
      data: update,
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in updateStep Controller ${error.message}`,
    });
  }
};

export const deleteStep = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const step = await prisma.step.findFirst({
      where: {
        id: Number(id)
      }
    });

    if (!step) {
      return res.status(404).json({
        status: "Failed",
        statusCode: 404,
        message: "Step Not Found"
      });
    }

    // > Hapus foto
    await fs.unlink(path.join(`public/${step.step_image}`));

    await prisma.step.delete({
      where: {
        id: Number(step.id)
      }
    });

    return res.status(200).json({
      status: "Success",
      statusCode: 200,
      message: `Success Delete Recipe: ${step.step_desc}`
    });

  } catch (error: any) {
    return res.status(400).json({
      status: "Failed",
      statusCode: 400,
      message: `Something Error in deleteStep Controller ${error.message}`,
    });
  }
}