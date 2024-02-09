const perms = {
    ADMINISTRATOR: 8,
    VIEW_AUDIT_LOG: 128,
    MANAGE_SERVER: 32,
    MANAGE_ROLES: 268435456,
    MANAGE_CHANNELS: 16,
    KICK_MEMBERS: 2,
    BAN_MEMBERS: 4,
    CREATE_INSTANT_INVITE: 1,
    CHANGE_NICKNAME: 67108864,
    MANAGE_NICKNAMES: 134217728,
    MANAGE_EXPRESSIONS: 1073741824,
    CREATE_EXPRESSIONS: 8796093022208,
    MANAGE_WEBHOOKS: 536870912,
    VIEW_CHANNEL_AND_READ_MESSAGES: 1024,
    MANAGE_EVENTS: 8589934592,
    CREATE_EVENTS: 17592186044416,
    MODERATE_MEMBERS: 1099511627776,
    VIEW_SERVER_INSIGHTS: 524288,
    VIEW_CREATOR_MONETIZATION_INSIGHTS: 2199023255552,
    SEND_MESSAGES: 2048,
    CREATE_PUBLIC_THREADS: 34359738368,
    CREATE_PRIVATE_THREADS: 68719476736,
    SEND_MESSAGES_IN_THREADS: 274877906944,
    SEND_TTS_MESSAGES: 4096,
    MANAGE_MESSAGES: 8192,
    MANAGE_THREADS: 17179869184,
    EMBED_LINKS: 16384,
    ATTACH_FILES: 32768,
    READ_MESSAGE_HISTORY: 65536,
    MENTION_EVERYONE: 131072,
    USE_EXTERNAL_EMOJIS: 262144,
    USE_EXTERNAL_STICKERS: 137438953472,
    ADD_REACTIONS: 64,
    USE_SLASH_COMMANDS: 2147483648,
    USE_EMBEDDED_ACTIVITIES: 549755813888,
    CONNECT: 1048576,
    SPEAK: 2097152,
    VIDEO: 512,
    MUTE_MEMBERS: 4194304,
    DEAFEN_MEMBERS: 8388608,
    MOVE_MEMBERS: 16777216,
    USE_VOICE_ACTIVITY: 33554432,
    PRIORITY_SPEAKER: 256,
    REQUEST_TO_SPEAK: 4294967296,
    USE_SOUNDBOARD: 4398046511104,
    USE_EXTERNAL_SOUNDS: 35184372088832
}

const permissionCalc = async (req, res) => {
    if (req.query.value == undefined) {
        return res.status(400).json({ error: `value must be defined` });
    } 

    const value = parseInt(req.query.value, 10);

    const result = {};

    for (const perm in perms) {
        if (perms.hasOwnProperty(perm)) {
            const permValue = perms[perm];
            result[perm] = (value & permValue) === permValue;
        }
    }

    if (req.query.type === "show_all") {
        return res.status(200).json(result);
    } else {
        const truePerms = Object.keys(result).filter(perm => result[perm]);
        return res.status(200).json(truePerms);
    }
}

module.exports = permissionCalc;