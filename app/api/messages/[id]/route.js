import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
export const dynamic = "force-dynamic";

//// PUT /api/messages/:id

export const PUT = async (request, { params }) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser || !sessionUser.userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const { userId } = sessionUser;
        const { id } = params;
        const message = await Message.findById(id);
        if (!message) {
            return new Response(
                JSON.stringify({ message: "Message not found" }),
                {
                    status: 404,
                }
            );
        }

        if (message.recipient.toString() !== userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        //// Update message to read/unread depending on the current status
        message.read = !message.read;
        await message.save();
        return new Response(
            JSON.stringify({
                message: "success",
                body: message,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ message: "Something went wrong" }),
            { status: 500 }
        );
    }
};
///// Delete /api/messages/:id

export const DELETE = async (request, { params }) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser || !sessionUser.userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const { userId } = sessionUser;
        const { id } = params;
        const message = await Message.findById(id);
        if (!message) {
            return new Response(
                JSON.stringify({ message: "Message not found" }),
                {
                    status: 404,
                }
            );
        }

        if (message.recipient.toString() !== userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }

        await message.deleteOne();
        return new Response(
            JSON.stringify({
                message: "success",
            }),
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ message: "Something went wrong" }),
            { status: 500 }
        );
    }
};
