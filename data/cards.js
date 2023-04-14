// data/cards.js
import { parseAnswer } from "@/utils/parseAnswer"
export const dummyCards = [
    {
        card_id: 0,
        mode: 'optimize',
        model: 'gpt-4',
        prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        answer: parseAnswer('optimize', JSON.stringify({
            'content': 'A landscape of rolling hills and rocky outcroppings in the Scottish Highlands',
            'medium': 'oil painting',
            'style': 'inspired by the Romanticism movement, with a touch of impressionism',
            'lighting': 'the warm glow of the setting sun casting long shadows across the hills',
            'colors': ' rich earthy tones with pops of vibrant greens and purples',
            'composition': 'A wide shot from a high angle, using a telephoto lens to compress the hills and create a sense of depth. The focal point is a small loch nestled among the hills, with a lone tree on its banks.',
            'prompt': 'Create an oil painting inspired by the Romanticism movement, with a touch of impressionism, depicting a landscape of rolling hills and rocky outcroppings in the Scottish Highlands at sunset. Use rich earthy tones with pops of vibrant greens and purples to emphasize the warm glow of the setting sun casting long shadows across the hills. The focal point of the painting should be a small loch nestled among the hills, with a lone tree on its banks. Take a wide shot from a high angle, using a telephoto lens to compress the hills and create a sense of depth.',
        })),
    },
    {
        card_id: 1,
        mode: 'explain',
        model: 'chatgpt',
        prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        answer: parseAnswer('explain', JSON.stringify({
            "main_object": "goddess-like figure",
            "medium": ["digital painting"],
            "style": ["surreal", "mystical"],
            "artists": ["N/A"],
            "lighting": ["stardust effect"],
            "colors": ["blues", "purples", "pinks"],
            "camera": ["wide-angle lens"],
            "perspective": ["center of the nebula", "arms outstretched"],
            "scale": ["N/A"]
        }))
    },
    {
        card_id: 2,
        mode: 'template',
        model: 'stable diffusion',
        prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        answer: parseAnswer('template', "This is a test prompt")
    }
]

export const dummyResponses = {
    'optimize': {
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
    'explain': {
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
    'template': {
        choices: [
            {
                message: {
                    content: "This is a test prompt"
                },
            },
        ],
    },
}
