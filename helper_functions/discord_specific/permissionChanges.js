const perms = require("../../object_holders/discord_specific/permsFlags");

function permissionChanges(oldAllow, oldDeny, newAllow, newDeny) {
  const changes = {};

  for (const perm in perms) {
    if (perms.hasOwnProperty(perm)) {
      const permValue = perms[perm];
      const oldAllowPerm = (oldAllow & permValue) === permValue;
      const oldDenyPerm = (oldDeny & permValue) === permValue;
      const newAllowPerm = (newAllow & permValue) === permValue;
      const newDenyPerm = (newDeny & permValue) === permValue;

      let changeType;

      switch (true) {
        case oldAllowPerm && !oldDenyPerm && newAllowPerm && !newDenyPerm:
          changeType = "no change";
          break;
        case oldAllowPerm && !oldDenyPerm && !newAllowPerm && !newDenyPerm:
          changeType = "allow/neutral";
          break;
        case oldAllowPerm && !oldDenyPerm && !newAllowPerm && newDenyPerm:
          changeType = "allow/deny";
          break;
        case !oldAllowPerm && oldDenyPerm && newAllowPerm && !newDenyPerm:
          changeType = "deny/allow";
          break;
        case !oldAllowPerm && oldDenyPerm && !newAllowPerm && !newDenyPerm:
          changeType = "deny/neutral";
          break;
        case !oldAllowPerm && oldDenyPerm && !newAllowPerm && newDenyPerm:
          changeType = "no change";
          break;
        case !oldAllowPerm && !oldDenyPerm && newAllowPerm && !newDenyPerm:
          changeType = "neutral/allow";
          break;
        case !oldAllowPerm && !oldDenyPerm && !newAllowPerm && !newDenyPerm:
          changeType = "no change";
          break;
        case !oldAllowPerm && !oldDenyPerm && !newAllowPerm && newDenyPerm:
          changeType = "neutral/deny";
          break;
        default:
          changeType = "unknown";
      }
      changes[perm] = changeType;
    }
  }

  return changes;
}

module.exports = permissionChanges;
