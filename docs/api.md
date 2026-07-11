# TradeSage-AI API Reference

All requests must have the `/api` prefix. Authenticated routes require a valid session cookie or authorization header.

## 🔐 Auth

### Register User
* **URL:** `POST /api/auth/register`
* **Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```

### Login User
* **URL:** `POST /api/auth/login`
* **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```

### Logout User
* **URL:** `POST /api/auth/logout`

### Get Current User Profile
* **URL:** `GET /api/auth/me` (Protected)

---

## 📈 Market & Stocks

### Search Stocks
* **URL:** `GET /api/stocks/search`
* **Query Params:** `q=query_string` (e.g., `/api/stocks/search?q=apple`)
* **Response (Normalized):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "symbol": "AAPL",
        "companyName": "APPLE INC",
        "exchange": "NASDAQ",
        "type": "Common Stock"
      }
    ]
  }
  ```

---

## 📋 Watchlist (Protected)

### Get All Watchlists
* **URL:** `GET /api/watchlists`
* **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "60d0fe4f5311236168a109ca",
        "userId": "60d0fe2c5311236168a109c8",
        "name": "Tech Stocks",
        "stocks": [
          {
            "symbol": "AAPL",
            "companyName": "APPLE INC"
          }
        ],
        "createdAt": "2026-07-11T04:00:00.000Z",
        "updatedAt": "2026-07-11T04:05:00.000Z"
      }
    ]
  }
  ```

### Create Watchlist
* **URL:** `POST /api/watchlists`
* **Body:**
  ```json
  {
    "name": "Dividend Growth"
  }
  ```

### Rename Watchlist
* **URL:** `PATCH /api/watchlists/:id`
* **Body:**
  ```json
  {
    "name": "New Watchlist Name"
  }
  ```

### Delete Watchlist
* **URL:** `DELETE /api/watchlists/:id`

### Add Stock to Watchlist
* **URL:** `POST /api/watchlists/:id/stocks`
* **Body:**
  ```json
  {
    "symbol": "TSLA",
    "companyName": "TESLA INC"
  }
  ```

### Remove Stock from Watchlist
* **URL:** `DELETE /api/watchlists/:id/stocks/:symbol`

---

## 💼 Orders (Protected)

### Create Order
* **URL:** `POST /api/orders`
* **Body:**
  ```json
  {
    "symbol": "AAPL",
    "type": "BUY",
    "quantity": 10,
    "price": 150.00
  }
  ```

### Get Orders
* **URL:** `GET /api/orders`

### Cancel Order
* **URL:** `DELETE /api/orders/:id`

---

## 📊 Portfolio (Protected)

### Get Portfolio
* **URL:** `GET /api/portfolio`

### Get Transactions
* **URL:** `GET /api/transactions`

---

## 🤖 AI Features (Protected)

### Get Portfolio Summary
* **URL:** `POST /api/ai/summary`

### Portfolio Chat
* **URL:** `POST /api/ai/portfolio-chat`

### Risk Check
* **URL:** `POST /api/ai/risk-check`