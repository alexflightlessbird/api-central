const perms = {
  ADMINISTRATOR: BigInt(8),
  VIEW_AUDIT_LOG: BigInt(128),
  MANAGE_SERVER: BigInt(32),
  MANAGE_ROLES: BigInt(268435456),
  MANAGE_CHANNELS: BigInt(16),
  KICK_MEMBERS: BigInt(2),
  BAN_MEMBERS: BigInt(4),
  CREATE_INSTANT_INVITE: BigInt(1),
  CHANGE_NICKNAME: BigInt(67108864),
  MANAGE_NICKNAMES: BigInt(134217728),
  MANAGE_EXPRESSIONS: BigInt(1073741824),
  CREATE_EXPRESSIONS: BigInt(8796093022208),
  MANAGE_WEBHOOKS: BigInt(536870912),
  VIEW_CHANNEL_AND_READ_MESSAGES: BigInt(1024),
  MANAGE_EVENTS: BigInt(8589934592),
  CREATE_EVENTS: BigInt(17592186044416),
  MODERATE_MEMBERS: BigInt(1099511627776),
  VIEW_SERVER_INSIGHTS: BigInt(524288),
  VIEW_CREATOR_MONETIZATION_INSIGHTS: BigInt(2199023255552),
  SEND_MESSAGES: BigInt(2048),
  CREATE_PUBLIC_THREADS: BigInt(34359738368),
  CREATE_PRIVATE_THREADS: BigInt(68719476736),
  SEND_MESSAGES_IN_THREADS: BigInt(274877906944),
  SEND_TTS_MESSAGES: BigInt(4096),
  MANAGE_MESSAGES: BigInt(8192),
  MANAGE_THREADS: BigInt(17179869184),
  EMBED_LINKS: BigInt(16384),
  ATTACH_FILES: BigInt(32768),
  READ_MESSAGE_HISTORY: BigInt(65536),
  MENTION_EVERYONE: BigInt(131072),
  USE_EXTERNAL_EMOJIS: BigInt(262144),
  USE_EXTERNAL_STICKERS: BigInt(137438953472),
  ADD_REACTIONS: BigInt(64),
  USE_SLASH_COMMANDS: BigInt(2147483648),
  USE_EMBEDDED_ACTIVITIES: BigInt(549755813888),
  CONNECT: BigInt(1048576),
  SPEAK: BigInt(2097152),
  VIDEO: BigInt(512),
  MUTE_MEMBERS: BigInt(4194304),
  DEAFEN_MEMBERS: BigInt(8388608),
  MOVE_MEMBERS: BigInt(16777216),
  USE_VOICE_ACTIVITY: BigInt(33554432),
  PRIORITY_SPEAKER: BigInt(256),
  REQUEST_TO_SPEAK: BigInt(4294967296),
  USE_SOUNDBOARD: BigInt(4398046511104),
  USE_EXTERNAL_SOUNDS: BigInt(35184372088832),
};

const permissionCalc = async (req, res) => {
  try {
    if (req.query.value == undefined) {
      return res.status(400).json({ error: `value must be defined` });
    }

    if (!/^\d+$/.test(req.query.value)) {
      return res
        .status(400)
        .json({ error: "Invalid value. Must be a non-negative number." });
    }

    const value = BigInt(req.query.value);

    const result = {};

    for (const perm in perms) {
      if (perms.hasOwnProperty(perm)) {
        const permValue = perms[perm];
        result[perm] = (value & permValue) === permValue;
      }
    }

    const truePerms = Object.keys(result).filter((perm) => result[perm]);

    if (req.query.type === "show_all") {
      return res.status(200).json(result);
    } else if (req.query.type === "string") {
      const truePermsString = truePerms.join(", ");
      return res.status(200).json({ permissions: truePermsString });
    } else {
      return res.status(200).json(truePerms);
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: `${err}` });
  }
};

module.exports = permissionCalc;
