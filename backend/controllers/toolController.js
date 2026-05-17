const Tool = require("../models/Tool");

const getTools = async (req, res) => {
  try {
    const tools = await Tool.find().sort({ createdAt: -1 });
    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTool = async (req, res) => {
  try {
    const tool = new Tool(req.body);
    await tool.save();
    res.status(201).json(tool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tool) return res.status(404).json({ message: "Tool not found" });
    res.json(tool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    if (!tool) return res.status(404).json({ message: "Tool not found" });
    res.json({ message: "Tool deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const incrementView = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!tool) return res.status(404).json({ message: "Tool not found" });
    res.json({ views: tool.views });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const tools = await Tool.find({}, "name views sales color icon").sort({ views: -1 });
    const totalViews = tools.reduce((s, t) => s + (t.views || 0), 0);
    const totalSales = tools.reduce((s, t) => s + (t.sales || 0), 0);
    res.json({ tools, totalViews, totalSales });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTools, createTool, updateTool, deleteTool, incrementView, getAnalytics };
