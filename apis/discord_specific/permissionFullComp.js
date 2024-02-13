const permissionChanges = require("../../helper-functions/discord_specific/permissionChanges");

const permissionComp = async (req, res) => {
  try {
    let oldAllow;
    if (!req.query.old_allow) {
      oldAllow = BigInt(0);
    } else if (!/^\d+$/.test(req.query.old_allow)) {
      return res
        .status(400)
        .json({ error: "Invalid old_allow. Must be a non-negative number." });
    } else {
      oldAllow = BigInt(req.query.old_allow);
    }

    let oldDeny;
    if (!req.query.old_deny) {
      oldDeny = BigInt(0);
    } else if (!/^\d+$/.test(req.query.old_deny)) {
      return res
        .status(400)
        .json({ error: "Invalid old_deny. Must be a non-negative number." });
    } else {
      oldDeny = BigInt(req.query.old_deny);
    }

    let newAllow;
    if (!req.query.new_allow) {
      newAllow = BigInt(0);
    } else if (!/^\d+$/.test(req.query.new_allow)) {
      return res
        .status(400)
        .json({ error: "Invalid new_allow. Must be a non-negative number." });
    } else {
      newAllow = BigInt(req.query.new_allow);
    }

    let newDeny;
    if (!req.query.new_deny) {
      newDeny = BigInt(0);
    } else if (!/^\d+$/.test(req.query.new_deny)) {
      return res
        .status(400)
        .json({ error: "Invalid new_deny. Must be a non-negative number." });
    } else {
      newDeny = BigInt(req.query.new_deny);
    }

    const changes = permissionChanges(oldAllow, oldDeny, newAllow, newDeny);
    const trueChanges = Object.keys(changes)
      .filter((perm) => changes[perm] !== "no change")
      .map((perm) => `${perm}: ${changes[perm]}`);
    const trueChangesString = trueChanges.join(", ");
    const emojiChanges = trueChanges.map((change) =>
      change
        .replace(/allow/g, ":white_check_mark:")
        .replace(/neutral/g, ":white_large_square:")
        .replace(/deny/g, ":x:")
        .replace(/\//g, " ➜ ")
    );

    if (req.query.type === "show_all") {
      return res.status(200).json(changes);
    } else if (req.query.type === "string") {
      return res.status(200).json({ changes: trueChangesString });
    } else if (req.query.type === "emojistring") {
      const emojiChangesString = emojiChanges.join(", ");
      return res.status(200).json({ changes: emojiChangesString });
    } else if (req.query.type === "emoji") {
      return res.status(200).json(emojiChanges);
    } else {
      return res.status(200).json(trueChanges);
    }

    res.json(changes);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = permissionComp;
