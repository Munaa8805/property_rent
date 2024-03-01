const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

async function fetchProperties() {
    try {
        if (!apiDomain) {
            return [];
        }
        const res = await fetch(`${apiDomain}/properties`, {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("Failed to fetch properties");
        }
        const data = await res.json();
        // console.log("data", data);
        return data.body;
    } catch (error) {
        // throw new Error("Failed to fetch properties");
        console.log(error);
        return [];
    }
}
async function fetchSingleProperty(id) {
    try {
        if (!apiDomain) {
            return [];
        }
        const res = await fetch(`${apiDomain}/properties/${id}`);
        if (!res.ok) {
            throw new Error("Failed to fetch properties");
        }
        const data = await res.json();
        // console.log("data", data);
        return data.body;
    } catch (error) {
        // throw new Error("Failed to fetch properties");
        console.log(error);
        return null;
    }
}

export { fetchProperties, fetchSingleProperty };
