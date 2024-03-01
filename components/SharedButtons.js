import React from "react";
import { FaShare } from "react-icons/fa";
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    EmailIcon,
} from "react-share";

const SharedButtons = ({ property }) => {
    const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property?._id}`;

    return (
        <>
            <h3 className="text-xl font-bold text-center pt-2">
                Share This Property
            </h3>
            <div className="flex gap-3 justify-center pb-5">
                <FacebookShareButton
                    url={shareUrl}
                    quote={property?.name}
                    hashtag={`#${property?.type}ForRent`}>
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                    url={shareUrl}
                    quote={property?.name}
                    hashtag={[
                        `${property?.type.replace(/\s/g, "")}ForRent`,
                        `${property?.type.replace(/\s/g, "")}ForProperty`,
                    ]}>
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton
                    url={shareUrl}
                    quote={property?.name}
                    separator=":: ">
                    <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <EmailShareButton
                    url={shareUrl}
                    subject={property?.name}
                    body={`Check out this property listing : ${shareUrl}`}>
                    <EmailIcon size={32} round />
                </EmailShareButton>
            </div>
        </>
    );
};

export default SharedButtons;
