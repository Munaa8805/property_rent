"use client";
import React, { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import Spinner from "./Spinner";
import Pagination from "./Pagination";

const PropertiesComponent = () => {
    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/properties?page=${page}&pageSize=${pageSize}`
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await res.json();
                setProperties(data.body);
                setTotalItems(data.total);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [page, pageSize]);
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    if (loading) {
        return <Spinner loading={loading} />;
    }
    return (
        <div className="container-xl lg:container m-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.length === 0 && (
                    <p className="text-center">No properties found</p>
                )}
                {properties &&
                    properties.map((property) => (
                        <PropertyCard key={property._id} property={property} />
                    ))}
            </div>
            <Pagination
                page={page}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default PropertiesComponent;
