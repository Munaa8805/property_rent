"use client";
import React, { useState, useEffect, useContext } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

const UnreadMessageCount = ({ session }) => {
    const { unreadCount, setUnreadCount } = useGlobalContext();

    useEffect(() => {
        if (!session) return;

        const fetchUnreadCount = async () => {
            try {
                const result = await fetch("/api/messages/unread-count");
                if (result.status === 200) {
                    const data = await result.json();
                    setUnreadCount(data.count);
                } else {
                    console.log("Something went wrong");
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUnreadCount();
    }, [session]);
    return unreadCount > 0 ? (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
        </span>
    ) : null;
};

export default UnreadMessageCount;
