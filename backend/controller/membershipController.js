const Membership = require("../model/membership");

// 📌 Add Membership
exports.addMembership = async (req, res) => {
  try {
    const { userId, membershipType } = req.body;

    let duration = 6;
    if (membershipType === "1 year") duration = 12;
    if (membershipType === "2 years") duration = 24;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    const membership = new Membership({
      userId,
      membershipType,
      startDate,
      endDate,
    });

    await membership.save();

    res.json({ message: "Membership added successfully", membership });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Get Membership
exports.getMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ userId: req.params.id })
      .populate("userId");
    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    res.json({ membership });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Extend Membership
exports.extendMembership = async (req, res) => {
  try {
    const { type, duration: requestDuration } = req.body;
    const selectedType = type || requestDuration || "6 months";

    let extensionMonths = 6;
    if (selectedType === "1 year") extensionMonths = 12;
    if (selectedType === "2 years") extensionMonths = 24;

    const membership = await Membership.findById(req.params.id);

    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    membership.endDate.setMonth(
      membership.endDate.getMonth() + extensionMonths
    );

    await membership.save();

    res.json({ message: "Membership extended", membership });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Cancel Membership
exports.cancelMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    membership.status = "cancelled";

    await membership.save();

    res.json({ message: "Membership cancelled" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};