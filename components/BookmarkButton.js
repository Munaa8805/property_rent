"use client";
import React, { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const BookmarkButton = ({ property }) => {
    const { data: session } = useSession();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const userId = session?.user?.id;
    const propertyId = property?._id;
    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }
        const checkBookmarkStatus = async () => {
            try {
                const res = await fetch("/api/bookmarks/check", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ propertyId }),
                });
                if (res.status === 200) {
                    const data = await res.json();
                    setIsBookmarked(data.isBookmarked);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        checkBookmarkStatus();
    }, [propertyId, userId]);

    const handleSubmit = async () => {
        if (!userId) {
            toast.error("Please login.");
            return;
        }
        try {
            const res = await fetch("/api/bookmarks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ propertyId }),
            });
            if (res.status === 200) {
                const data = await res.json();

                toast.success(data.message);
                setIsBookmarked(data.isBookmarked);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <span>Loading...</span>;
    }
    return isBookmarked ? (
        <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
            onClick={handleSubmit}>
            <FaBookmark className="mr-2" /> Remove Bookmark
        </button>
    ) : (
        <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
            onClick={handleSubmit}>
            <FaBookmark className="mr-2" /> Bookmark Property
        </button>
    );
};

export default BookmarkButton;
