## Chat Completion Data Schema

```
const **chat_payload: Dict** = {
    model: $model
    messages: [
        {role: "system", content: "systemMessage"},
        {role: "user", content" "userMessage}
    ]
}

const response:  = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_APIKEY,
        },
        body: JSON.stringify(payload),
    })
const **response_json: Dictionary** = response.json()

const message: **JSON_STRING** = response_json.choices[0].message.content

const message_content: **JSON** = JSON.parse(message)
```
