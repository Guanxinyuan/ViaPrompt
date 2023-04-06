// data/cards.js

export const dummyCards = [
    {
        cardId: '1012321',
        mode: "Optimize",
        model: 'ChatGPT',
        originalPrompt: "sun, star, moon",
        optimizedPrompt: "Create an oil painting that portrays a majestic elephant crossing a river during the golden hour. The style should blend Realism with Impressionism, with a touch of influence from Japanese woodblock prints. Use earthy browns and greens as the dominant color palette, with pops of vibrant oranges and blues to accentuate the elephant's grace and power. The composition should be a wide-angle shot from a low angle, capturing the elephant's reflection in the water and emphasizing its grandeur.",
        explanation: {
            "content": "A lone traveler wandering through a dense forest.",
            "medium": "Digital painting",
            "style": "Surrealism meets Dark Fantasy",
            "lighting": "Dappled sunlight filtering through the leaves",
            "colors": "Muted greens, browns, and earth tones contrasted by vibrant pops of reds and oranges",
            "composition": "A wide-angle lens shot from a low angle, with the traveler centered and towering trees framing the scene",
        },
        timestamp: "2022-03-29T00:00:00.000Z"
    },
    {
        cardId: '1012322',
        mode: "Template",
        model: 'GPT-4',
        originalPrompt: "A vibrant steampunk cityscape filled with bustling airships, digital painting, reminiscent of the works of Syd Mead and Ian McQue, golden hour, with warm sunlight casting long shadows and illuminating the buildings, rich sepia tones, with hints of brass and copper accents, wide-angle lens to capture the expansive city, airships at various depths to create a sense of depth, and a birds-eye view to emphasize the grand scale of the scene",
        templatePrompt: "A {{vibrant}} steampunk cityscape filled with bustling airships, {{digital painting}}, reminiscent of the works of Syd Mead and Ian McQue, golden hour, with warm sunlight casting long shadows and illuminating the buildings, rich sepia tones, with hints of brass and copper accents, wide-angle lens to capture the expansive city, airships at various depths to create a sense of depth, and a birds-eye view to emphasize the grand scale of the scene",
        timestamp: "2022-03-28T00:00:00.000Z"
    },
    {
        cardId: '1012323',
        mode: "Decompose",
        model: 'Midjourney V4',
        originalPrompt: "A vibrant steampunk cityscape filled with bustling airships, digital painting, reminiscent of the works of Syd Mead and Ian McQue, golden hour, with warm sunlight casting long shadows and illuminating the buildings, rich sepia tones, with hints of brass and copper accents, wide-angle lens to capture the expansive city, airships at various depths to create a sense of depth, and a birds-eye view to emphasize the grand scale of the scene",
        explanation: {
            "main_object": "steampunk cityscape with airships",
            "medium": ["digital painting"],
            "style": ["steampunk", "Syd Mead", "Ian McQue"],
            "artists": ["Syd Mead", "Ian McQue"],
            "lighting": ["golden hour", "warm sunlight"],
            "colors": ["sepia tones", "brass accents", "copper accents"],
            "camera": ["wide-angle lens"],
            "perspective": ["birds-eye view", "depth of field", "airships at various depths"],
            "scale": ["grand scale of the scene"],
            "composition": null,
        },
        timestamp: "2022-03-27T00:00:00.000Z"
    },
]

export const dummyResponses = {
    'Optimize': {
        choices: [
            {
                message: {
                    content: JSON.stringify({
                        'content': 'A landscape of rolling hills and rocky outcroppings in the Scottish Highlands',
                        'medium': 'oil painting',
                        'style': 'inspired by the Romanticism movement, with a touch of impressionism',
                        'lighting': 'the warm glow of the setting sun casting long shadows across the hills',
                        'colors': ' rich earthy tones with pops of vibrant greens and purples',
                        'composition': 'A wide shot from a high angle, using a telephoto lens to compress the hills and create a sense of depth. The focal point is a small loch nestled among the hills, with a lone tree on its banks.',
                        'prompt': 'Create an oil painting inspired by the Romanticism movement, with a touch of impressionism, depicting a landscape of rolling hills and rocky outcroppings in the Scottish Highlands at sunset. Use rich earthy tones with pops of vibrant greens and purples to emphasize the warm glow of the setting sun casting long shadows across the hills. The focal point of the painting should be a small loch nestled among the hills, with a lone tree on its banks. Take a wide shot from a high angle, using a telephoto lens to compress the hills and create a sense of depth.',
                    }),
                },
            },
        ],
    },
    'Decompose': {
        choices: [
            {
                message: {
                    content: JSON.stringify({
                        "main_object": "goddess-like figure",
                        "medium": ["digital painting"],
                        "style": ["surreal", "mystical"],
                        "artists": ["N/A"],
                        "lighting": ["stardust effect"],
                        "colors": ["blues", "purples", "pinks"],
                        "camera": ["wide-angle lens"],
                        "perspective": ["center of the nebula", "arms outstretched"],
                        "scale": ["N/A"]
                    }),
                },
            },
        ],
    },
}
