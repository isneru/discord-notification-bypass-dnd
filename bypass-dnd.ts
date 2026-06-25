import definePlugin from "@utils/types";

export default definePlugin({
    name: "BypassDnD",
    description: 'Show desktop notifications even when Discord status is "Do Not Disturb"',
    authors: [{ name: "isneru", id: 0n }],

    patches: [
        {
            find: ".SUPPRESS_NOTIFICATIONS))return!1",
            replacement: {
                // The shouldNotify function delegates the DnD status check to a
                // helper K(user, author, channel, { ignoreStatus, ... }). Forcing
                // ignoreStatus to true makes it skip the DnD check entirely.
                match: /\{ignoreStatus:\w+,ignoreSameUser:/,
                replace: "{ignoreStatus:true,ignoreSameUser:",
            },
        },
    ],
});
