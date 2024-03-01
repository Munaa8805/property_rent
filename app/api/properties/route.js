import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";






//// GET /api/properties
export const GET = async (request) => {
    try {
        await connectDB();
        const page = request.nextUrl.searchParams.get("page") || 1;
        const pageSize = request.nextUrl.searchParams.get("pageSize") || 3;
        const skip = (page - 1) * pageSize;
        const totalProperties = await Property.countDocuments({});
        // const properties = await Property.find({});

        const properties = await Property.find({}).skip(skip).limit(pageSize);
        return new Response(
            JSON.stringify({
                message: "success",
                body: properties,
                total: totalProperties,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            {
                message: "unsuccessful",
                body: error.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
};
export const POST = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser || !sessionUser.userId) {
            return new Response(
                {
                    message: "unsuccessful",
                },
                { status: 401 }
            );
        }
        const { userId } = sessionUser;
        const formData = await request.formData();
        const amenities = formData.getAll("amenities");
        const images = formData
            .getAll("images")
            .filter((image) => image.size > 0);
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
        // body.images = images;
        body.owner = userId;

        ///// Upload images to cloudinary
        const imageUploadPromises = [];
        for (const image of images) {
            const imageBuffer = await image.arrayBuffer();
            const imageArray = Array.from(new Uint8Array(imageBuffer));
            const imageData = Buffer.from(imageArray);
            //// CONVERT TO BASE64

            const imageBase64 = imageData.toString("base64");
            //// Make request to cloudinary
            const uploadResult = await cloudinary.uploader.upload(
                `data:image/jpg;base64,${imageBase64}`,
                {
                    folder: "property-rent",
                }
            );
            imageUploadPromises.push(uploadResult.secure_url);
            //// await all images to be uploaded
            const uploadImages = await Promise.all(imageUploadPromises);
            body.images = uploadImages;
        }

        const newProperty = new Property(body);
        await newProperty.save();

        return Response.redirect(
            `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
        );
    } catch (error) {
        return new Response(
            {
                message: "unSeccessful",
                body: error.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
};