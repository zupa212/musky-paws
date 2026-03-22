import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Musky Paws Dog Grooming",
        short_name: "Musky Paws",
        description: "Dog grooming στην Περαία Θεσσαλονίκης για full grooming, bath & brush, deshedding και περιποίηση κουταβιών.",
        start_url: "/",
        display: "standalone",
        background_color: "#fff6f7",
        theme_color: "#f7b7bc",
        icons: [
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
            },
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
