"use client";
import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import FeaturedProperty from "./FeaturedProperty";

const FeaturedProperties = () => {
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchFeaturedProperties = async () => {
            try {
                const response = await fetch("/api/properties/featured");
                const result = await response.json();
                setFeaturedProperties(result.body);
            } catch (error) {
                console.log("Error fetching featured properties:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeaturedProperties();
    }, []);

    return (
        <section className="bg-blue-50 px-4 pt-6 pb-10">
            <div className="container-xl lg:container m-auto">
                <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
                    Featured Properties
                </h2>
                {isLoading && <Spinner loading={isLoading} />}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {!isLoading && featuredProperties.length === 0 && (
                        <div className="text-center text-2xl font-bold mt-10">
                            No featured properties found
                        </div>
                    )}
                    {featuredProperties.map((property, index) => (
                        <FeaturedProperty
                            key={index}
                            featuredProperty={property}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProperties;
