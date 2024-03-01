import connectDB from "@/config/database";
import Property from "@/models/Property";

//// GET /api/properties/search

export const GET = async (request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const location = searchParams.get("location");
        const propertyType = searchParams.get("propertyType");
        const locationPattern = new RegExp(location, "i");

        let query = {
            $or: [
                { name: { $regex: locationPattern } },
                { description: { $regex: locationPattern } },
                { "location.street": { $regex: locationPattern } },
                { "location.city": { $regex: locationPattern } },
                { "location.state": { $regex: locationPattern } },
                { "location.zipcode": { $regex: locationPattern } },
            ],
        };
        //// Only check for property if it is not "All"
        if (propertyType && propertyType !== "All") {
            const propertyTypePattern = new RegExp(propertyType, "i");
            query.type = propertyTypePattern;
        }

        const properties = await Property.find(query);
        return new Response(
            JSON.stringify({
                message: "success",
                body: properties,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            "Something went wrong",

            { status: 500 }
        );
    }
};
