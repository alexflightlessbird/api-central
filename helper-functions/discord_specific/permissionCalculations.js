const perms = require("../../object_holders/discord_specific/permsFlags");

const permissionCalculations = (permission) => {
  const value = BigInt(permission);

  const result = {};

  for (const perm in perms) {
    if (perms.hasOwnProperty(perm)) {
      const permValue = perms[perm];
      result[perm] = (value & permValue) === permValue;
    }
  }

  return result;
};

module.exports = permissionCalculations;
