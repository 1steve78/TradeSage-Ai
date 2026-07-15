               Market API
                    |
                    v
            Socket Server
                    |
                    v
React <--------> Express
                    |
                    |
             AI Service
                    |
                    v
              Gemini/OpenAI

                    |
                    v
               MongoDB

---

# Real-time Price Update Flow

```text
Market API

↓

Market Service

↓

Socket Server

↓

Rooms

↓

React Socket Context

↓

Market Store

↓

UI
```