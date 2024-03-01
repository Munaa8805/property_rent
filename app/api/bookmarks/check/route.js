import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
export const dynamic = "force-dynamic";

export const POST = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        const { propertyId } = await request.json();

        if (!sessionUser || !sessionUser.userId) {
            return new Response("User ID  is required", { status: 401 });
        }

        const user = await User.findOne({ _id: sessionUser.userId });

        ///// Check if the property is already bookmarked

        let isBookmarked = user.bookmarks.includes(propertyId);

        await user.save();

        return new Response(
            JSON.stringify({
                isBookmarked,
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
