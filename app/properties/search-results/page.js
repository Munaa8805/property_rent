"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import { FaArrowLeft } from "react-icons/fa";

const SearchResultsPage = () => {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const location = searchParams.get("location");
    const propertyType = searchParams.get("propertyType");

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(
                    `/api/properties/search?location=${location}&propertyType=${propertyType}`
                );

                if (response.status === 200) {
                    const data = await response.json();
                    setProperties(data.body);
                    setIsLoading(false);
                } else {
                    setProperties([]);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSearchResults();
    }, [location, propertyType]);
    if (isLoading) {
        return <Spinner loading={isLoading} />;
    }

    return (
        <section className="px-4 py-6">
            <div className="container-xl lg:container m-auto">
                <h1 className="text-3xl text-center mb-4">Search Results</h1>
                {properties.length !== 0 && (
                    <Link
                        href="/"
                        className="text-blue-500 hover:text-blue-600 flex items-center mb-4">
                        <FaArrowLeft className="mr-2" /> Back to Home
                    </Link>
                )}
                {properties.length === 0 ? (
                    <div className="container-xl lg:container m-auto px-4 py-6">
                        <Link
                            href="/properties"
                            className="text-blue-500 hover:text-blue-600 flex items-center">
                            <FaArrowLeft className="mr-2" /> Back to Properties
                        </Link>
                        <p className="text-2xl text-center">
                            No search results found
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {properties.map((property) => (
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

export default SearchResultsPage;
