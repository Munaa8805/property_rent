"use client";
import React, { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

const SavedPropertiesPage = () => {
    const [savedProperties, setSavedProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSavedProperties = async () => {
            try {
                const res = await fetch("/api/bookmarks", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (res.status === 200) {
                    const data = await res.json();
                    console.log("Saved properties:", data);

                    setSavedProperties(data.body);
                    setIsLoading(false);
                } else {
                    console.log(res.statusText);
                    toast.error("Failed to fetch saved properties");
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch saved properties");
            } finally {
                setIsLoading(false);
            }
        };
        if (savedProperties.length === 0) {
            fetchSavedProperties();
        }
    }, [savedProperties]);

    if (isLoading) {
        return <Spinner loading={isLoading} />;
    }
    return (
        <section className="px-4 py-6">
            <h1 className="text-2xl text-center font-bold mb-4">
                Saved Properties
            </h1>
            <div className="container-xl lg:container m-auto">
                {savedProperties?.length === 0 ? (
                    <p className="text-center">No saved properties found</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {savedProperties.map((property) => (
                            <PropertyCard
                                key={property._id}
                                property={property}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default SavedPropertiesPage;
