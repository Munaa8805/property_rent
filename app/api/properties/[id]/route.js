import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

//// GET /api/properties/:id
export const GET = async (request, { params }) => {
    try {
        await connectDB();
        const property = await Property.findById(params.id);
        if (!property) {
            return new Response("Property not found", { status: 404 });
        }
        return new Response(
            JSON.stringify({
                message: "success",
                body: property,
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

///// DELETE /api/properties/:id
export const DELETE = async (request, { params }) => {
    try {
        await connectDB();
        const propertyId = params.id;
        const sessionUser = await getSessionUser();
        if (!sessionUser || !sessionUser.userId) {
            return new Response("Unauthorized", { status: 401 });
        }
        const { userId } = sessionUser;
        if (!propertyId) {
            return new Response("Property ID is required", { status: 400 });
        }
        const property = await Property.findById(propertyId);
        if (!property) {
            return new Response("Property not found", { status: 404 });
        }
        //// Check if the property belongs to the user
        if (property.owner.toString() !== userId) {
            return new Response("Unauthorized", { status: 401 });
        }
        await Property.findByIdAndDelete(propertyId);
        return new Response(
            JSON.stringify({
                message: "Property deleted successfully",
                body: property,
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

///// PUT /api/properties/:id

export const PUT = async (request, { params }) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser || !sessionUser.userId) {
            return new Response("User ID  is required", { status: 401 });
        }
        const { id } = params;
        const { userId } = sessionUser;
        const formData = await request.formData();
        const amenities = formData.getAll("amenities");

        ///// Get property to update
        const existingProperty = await Property.findById(id);
        if (!existingProperty) {
            return new Response("Property not found", { status: 404 });
        }
        //// Check if the property belongs to the user
        if (existingProperty.owner.toString() !== userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        //// Create property data object
        const body = {
            type: formData.get("type"),
            name: formData.get("name"),
            description: formData.get("description"),
            location: {
                street: formData.get("location.street"),
                city: formData.get("location.city"),
                state: formData.get("location.state"),
                zipcode: formData.get("location.zipcode"),
            },
            beds: formData.get("beds"),
            baths: formData.get("baths"),
            square_feet: formData.get("square_feet"),
            rates: {
                weekly: formData.get("rates.weekly"),
                monthly: formData.get("rates.monthly"),
                nightly: formData.get("rates.nightly"),
            },
            seller_info: {
                name: formData.get("seller_info.name"),
                email: formData.get("seller_info.email"),
                phone: formData.get("seller_info.phone"),
            },
        };
        body.amenities = amenities;
        body.owner = userId;
        //// Update property to database

        const updatedProperty = await Property.findByIdAndUpdate(id, body);

        return new Response(
            JSON.stringify({
                message: "success",
                body: updatedProperty,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            {
                message: "Unseccessful",
                body: error.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
};