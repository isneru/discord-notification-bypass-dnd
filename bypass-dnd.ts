import definePlugin from "@utils/types";

// Discord's notification gate (shouldNotify) checks several conditions before
// showing a desktop notification. One of them is the user's own DnD status:
// if the current user's status is "dnd", the function returns false and no
// notification is shown. This plugin removes that check so notifications always
// get through regardless of status.
//
// The function is found at runtime by Vencord via the SUPPRESS_NOTIFICATIONS
// flag check it also contains (same function, different condition).
//
// If the patch stops working after a Discord update, open DevTools (Ctrl+Shift+I)
// and run: Vencord.Webpack.findByCode(".SUPPRESS_NOTIFICATIONS))").toString()
// Look for the "dnd" check and update the match regex below.

export default definePlugin({
    name: "BypassDnD",
    description: 'Show desktop notifications even when Discord status is "Do Not Disturb"',
    authors: [{ name: "isneru", id: 0n }],

    patches: [
        {
            find: ".SUPPRESS_NOTIFICATIONS))",
            replacement: {
                // matches: someVar.status === "dnd"
                match: /\w+\.status===["']dnd["']/,
                replace: "false",
            },
        },
    ],
});
