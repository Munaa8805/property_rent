import connectDB from "@/config/database";
import Message from "@/models/Message";

import { getSessionUser } from "@/utils/getSessionUser";
export const dynamic = "force-dynamic";

//// GET /api/messages
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
        const readMessages = await Message.find({
            recipient: userId,
            read: true,
        })
            .sort({
                createdAt: -1,
            })
            .populate("sender", "username")
            .populate("property", "name");

        const unreadMessages = await Message.find({
            recipient: userId,
            read: false,
        })
            .sort({
                createdAt: -1,
            })
            .populate("sender", "username")
            .populate("property", "name");
        const messages = [...unreadMessages, ...readMessages];
        return new Response(
            JSON.stringify({
                message: "success",
                body: messages,
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

//// POST /api/messages

export const POST = async (request) => {
    try {
        await connectDB();
        const { name, email, phone, message, property, recipient } =
            await request.json();
        const sessionUser = await getSessionUser();
        if (!sessionUser || !sessionUser.userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const { userId } = sessionUser;
        /// can not send message to self

        if (recipient === userId) {
            return new Response(
                JSON.stringify({
                    message: "You can not send message to yourself.",
                }),
                { status: 402 }
            );
        }

        const newMessage = new Message({
            name,
            sender: userId,
            recipient,
            property,
            email,
            phone,
            body: message,
        });
        await newMessage.save();
        return new Response(
            JSON.stringify({
                message: "success",
                body: newMessage,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return new Response("Something went wrong", { status: 500 });
    }
};
