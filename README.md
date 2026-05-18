
# Banana Space 🍌
Banana Space is a platform for all forms of realti mecommunication in one place. (Chat | Voice | Video)

I'd be easier just to take a look [here](https://bananaspace.vercel.app).


## Tech stack

- **React**
- **Next.js 16.2.6**
- **Tailwindcss**
- **Socket.io**
- **Drizzle**
- **NeonDB**
- **Shadcn/ui**
- **LiveKit**
- **Uploadthing**
- **BetterAuth**
 

### Key Features:

- Real-time messaging using Socket.io
- Send attachments as messages using UploadThing (images, pdfs)
- Delete & Edit messages in real time for all users
- Create Text, Audio and Video call Channels
- 1:1 conversation between members
- 1:1 video calls between members
- Member management (Kick, Role change Guest / Moderator)
- Unique invite link generation & full working invite system
- Infinite loading for messages in batches of 10 (tanstack/query)
- Server creation/customization
- UI using TailwindCSS and ShadcnUI
- Fully responsive UI
- Light / Dark mode
- Websocket fallback: Polling with alerts
- ORM using Drizzle
- Neon database 
- Authentication with BetterAuth


## ERD:

```mermaid
erDiagram
  user {
    text id PK
    text name
    text email
    text username
    text image
    boolean email_verified
  }
  session {
    text id PK
    text user_id FK
    text token
    timestamp expires_at
  }
  account {
    text id PK
    text user_id FK
    text provider_id
    text account_id
    text password
  }
  verification {
    text id PK
    text identifier
    text value
    timestamp expires_at
  }
  server {
    text id PK
    text owner_id FK
    text name
    text image_url
    text invite_code
  }
  member {
    text id PK
    text user_id FK
    text server_id FK
    enum role
  }
  channel {
    text id PK
    text server_id FK
    text created_by_id FK
    text name
    enum type
  }
  message {
    text id PK
    text member_id FK
    text channel_id FK
    text content
    boolean deleted
    timestamp created_at
  }
  conversation {
    text id PK
    text member_one_id FK
    text member_two_id FK
  }
  direct_message {
    text id PK
    text member_id FK
    text conversation_id FK
    text content
    boolean deleted
    timestamp created_at
  }

  user ||--o{ session : "has"
  user ||--o{ account : "via"
  user ||--o{ member : "joins as"
  user ||--o{ server : "owns"
  server ||--o{ member : "has"
  server ||--o{ channel : "contains"
  member ||--o{ message : "sends"
  member ||--o{ direct_message : "sends"
  member ||--o{ conversation : "starts"
  member ||--o{ conversation : "receives"
  channel ||--o{ message : "has"
  conversation ||--o{ direct_message : "has"
```