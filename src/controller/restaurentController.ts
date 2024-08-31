import { Request, Response } from "express";
import Restaurent from "../model/restaurent";

const getRestaurent = async (req: Request, res: Response) => {
  try {
    const restaurentId = req.params.restaurentId;
    const restaurent = await Restaurent.findById(restaurentId);
    if (!restaurent) {
      return res.status(404).json({ message: "restaurent not found" });
    }
    res.json(restaurent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const searchRestaurent = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;
    let query: any = {};
    query["city"] = new RegExp(city, "i");
    const cityCheck = await Restaurent.countDocuments(query);
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }
    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cuisinesArray };
    }
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        {
          restaurentName: searchRegex,
        },
        {
          cuisines: { $in: [searchRegex] },
        },
      ];
    }
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const restaurents = await Restaurent.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();
    const total = await Restaurent.countDocuments(query);
    const response = {
      data: restaurents,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  searchRestaurent,
  getRestaurent,
};
