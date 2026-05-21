const MenuItem = require("../models/MenuItem");

const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      isVeg,
      isVegan,
      spiceLevel,
      popularity,
      preparationTime,
      tags,
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : image;
    const parsedTags =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : tags;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      image: imagePath,
      category,
      isVeg: isVeg === "false" || isVeg === false ? false : true,
      isVegan: isVegan === "true" || isVegan === true,
      spiceLevel,
      popularity,
      preparationTime,
      tags: parsedTags,
    });

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }

    if (updateData.preparationTime) {
      updateData.preparationTime = Number(updateData.preparationTime);
    }

    if (updateData.popularity) {
      updateData.popularity = Number(updateData.popularity);
    }

    if (updateData.tags && typeof updateData.tags === "string") {
      updateData.tags = updateData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    if (updateData.isVeg !== undefined) {
      updateData.isVeg = updateData.isVeg === "true" || updateData.isVeg === true;
    }

    if (updateData.isVegan !== undefined) {
      updateData.isVegan =
        updateData.isVegan === "true" || updateData.isVegan === true;
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getSingleMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
