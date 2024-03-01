import connectDB from "@/config/database";
import Message from "@/models/Message";

import { getSessionUser } from "@/utils/getSessionUser";
export const dynamic = "force-dynamic";

//// GET /api/messages/unread-count
export const GET = async () => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser || !sessionUser.userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const { userId } = sessionUser;

        const unreadMessagesCount = await Message.countDocuments({
            recipient: userId,
            read: false,
        })
            .sort({
                createdAt: -1,
            })
            .populate("sender", "username")
            .populate("property", "name");

        return new Response(
            JSON.stringify({
                message: "success",
                count: unreadMessagesCount,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            {
                message: "unsuccessfull",
                body: error.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
};
