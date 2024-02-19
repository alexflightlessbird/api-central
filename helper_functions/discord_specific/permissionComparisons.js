const perms = require("../../object_holders/discord_specific/permsFlags");

const permissionComparisons = (permission1, permission2) => {
  const value1 = BigInt(permission1);
  const value2 = BigInt(permission2);

  const result = {};

  for (const perm in perms) {
    if (perms.hasOwnProperty(perm)) {
      const permValue = perms[perm];
      const permInValue1 = (value1 & permValue) === permValue;
      const permInValue2 = (value2 & permValue) === permValue;

      if (permInValue1 !== permInValue2) {
        result[perm] = {
          value1: permInValue1,
          value2: permInValue2,
        };
      }
    }
  }

  return result;
};

module.exports = permissionComparisons;
