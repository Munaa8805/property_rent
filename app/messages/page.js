"use client";
import React, { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import Message from "@/components/Message";

const MessagePage = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getFetchMessages = async () => {
            try {
                const fetchMessages = await fetch("/api/messages");

                if (fetchMessages.status === 200) {
                    const data = await fetchMessages.json();

                    setMessages(data.body);
                    setIsLoading(false);
                } else {
                    console.log("Error fetching messages");
                    setIsLoading(false);
                }
            } catch (error) {
                console.log("Error fetching messages:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getFetchMessages();
    }, []);
    if (isLoading) {
        return <Spinner loading={isLoading} />;
    }

    return (
        <section className="bg-blue-50">
            <div className="container m-auto py-24 max-w-6xl">
                <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                    <h1 className="text-3xl font-bold mb-4">Your Messages</h1>

                    <div className="space-y-4">
                        {messages.length === 0 ? (
                            <p>You have no messages</p>
                        ) : (
                            messages.map((message) => {
                                return (
                                    <Message
                                        message={message}
                                        key={message._id}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MessagePage;
