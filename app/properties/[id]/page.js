"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchSingleProperty } from "@/utils/request";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import PropertyDetails from "@/components/PropertyDetails";
import Spinner from "@/components/Spinner";
import PropertyImage from "@/components/PropertyImage";
import { FaArrowLeft } from "react-icons/fa";
import BookmarkButton from "@/components/BookmarkButton";
import SharedButtons from "@/components/SharedButtons";
import PropertyContactForm from "@/components/PropertyContactForm";
import GalleryImage from "@/components/GalleryImage";

const PropertyPage = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchPropertyData = async () => {
            if (!id) return;
            try {
                const fetchProperty = await fetchSingleProperty(id);
                // console.log("fetchProperty", fetchProperty);
                setProperty(fetchProperty);
            } catch (error) {
                console.log("Error fetching property:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (property === null) {
            fetchPropertyData();
        }
    }, [id, property]);
    if (!property && !isLoading) {
        return (
            <div className="text-center text-2xl font-bold mt-10">
                Property not found
            </div>
        );
    }

    return (
        <>
            {isLoading && <Spinner loading={isLoading} />}
            {!isLoading && property && (
                <PropertyHeaderImage image={property.images[0]} />
            )}
            <section>
                <div className="container m-auto py-6 px-6">
                    <Link
                        href="/properties"
                        className="text-blue-500 hover:text-blue-600 flex items-center">
                        <FaArrowLeft className="mr-2" /> Back to Properties
                    </Link>
                </div>
            </section>
            <section className="bg-blue-50">
                <div className="container m-auto py-10 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
                        {property && <PropertyDetails property={property} />}

                        <aside className="space-y-4">
                            <BookmarkButton property={property} />

                            <SharedButtons property={property} />

                            <PropertyContactForm property={property} />
                        </aside>
                    </div>
                </div>
            </section>
            {/* {property && <PropertyImage images={property.images} />} */}
            {property && <GalleryImage images={property.images} />}
        </>
    );
};

export default PropertyPage;
