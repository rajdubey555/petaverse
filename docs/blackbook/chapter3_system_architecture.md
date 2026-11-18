# Chapter 3: System Design & Architecture

## 3.1 System Architecture Diagram

The System Architecture of **Petaverse** follows a modern **Three-Tier Architecture**, which cleanly separates the system into distinct presentation, application logic, and data storage layers. This architectural decoupling ensures high scalability, maintainability, responsive user experiences, and enhanced security.

---

### Architectural Layers Overview

1. **Presentation Layer (Frontend / Client Tier):**
   - Built with **React 18**, **Vite**, and **Tailwind CSS**.
   - Manages interactive user interfaces including pet listing, pet registration, adoption management, and instant QR collar tag generation/scanning.
   - Utilizes Redux Toolkit / React Context for predictable client-side state management and Axios for asynchronous HTTP REST API communication.

2. **Application / Business Logic Layer (Backend Tier):**
   - Built using **Node.js** and **Express.js**.
   - Handles route handling, request validation, authentication via JWT and Google OAuth2, rate limiting, and business logic execution (such as Lost Pet SOS triggers, collar tag linking, and adoption approval workflows).
   - Serves as the secure mediator between client requests and database queries.

3. **Data Layer (Database & Storage Tier):**
   - **MongoDB Atlas** (via Mongoose ODM) provides persistent storage for user credentials, pet medical histories, QR registration data, and adoption applications.
   - **Cloudinary CDN** handles optimized cloud asset storage for pet photos and vaccination records.

---

### Request-Response Data Flow Cycle

```mermaid
graph TD
    %% Styling
    classDef reactBox fill:#f0f9ff,stroke:#0284c7,stroke-width:2px,color:#0f172a,rx:10px;
    classDef expressBox fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#0f172a,rx:10px;
    classDef mongoBox fill:#fefce8,stroke:#ca8a04,stroke-width:2px,color:#0f172a,rx:10px;
    classDef pill fill:#0284c7,stroke:#0369a1,stroke-width:1px,color:#ffffff,rx:5px;

    UI_Pill["✨ UI is updated!"]:::pill
    ReactNode["User fills out form / interacts in React<br/>(Pet Registration, QR Scan, Lost SOS)"]:::reactBox
    ExpressReq["Express server receives<br/>and processes request"]:::expressBox
    MongoNode["MongoDB & Cloudinary<br/>stores / retrieves data"]:::mongoBox
    ExpressRes["Express server prepares<br/>and sends response"]:::expressBox

    UI_Pill -.-> ReactNode
    ReactNode -->|"Data sent via HTTP (REST / JSON)"| ExpressReq
    ExpressReq -->|"Query / Mutate Database"| MongoNode
    MongoNode -->|"Database response"| ExpressRes
    ExpressRes -->|"HTTP JSON response (200 OK)"| ReactNode
```

---

### Diagram Asset

- High-Resolution Vector Diagram: `docs/blackbook/system_architecture_diagram.svg`


## 3.2 Use-Case Diagram

The Use-Case diagram models the interactions between the primary external actors (**Admin**, **Moderator / Sub-Admin**, and **Pet Owner / Adopter**) and the core functional capabilities of the **Petaverse Portal**. It outlines system boundaries, access restrictions, and dependencies (`<<include>>` and `<<extend>>` associations).

---

### Actor Definitions

1. **Admin (System Administrator):**
   - Possesses unrestricted platform access.
   - Manages user accounts, configures pet categories, oversees overall adoption workflows, reviews audit logs, and monitors analytics.

2. **Sub-Admin / Moderator:**
   - Granted limited, operational administration privileges.
   - Responsible for moderating incoming pet adoption/safety profiles, monitoring community reports, and assisting in tracking active Lost Pet SOS broadcasts.

3. **Pet Owner / Adopter (Standard User):**
   - Registers and manages personal pet profiles.
   - Generates and downloads digital QR collar tags.
   - Triggers one-click Lost Pet SOS alerts to activate community beacon mode.
   - Explores, filters, and saves pets for adoption, and submits adoption inquiries or inappropriate content reports.

---

### Diagram Asset

- Vector File (Pure White Background for Black Book print): `docs/blackbook/use_case_diagram.svg`

```mermaid
graph LR
    subgraph Petaverse_Portal["Petaverse Portal"]
        UC1((Manage User Accounts))
        UC2((Moderate Pet Listings))
        UC3((Review Flagged Reports))
        UC4((Track Lost Pet SOS))
        UC5((Configure Pet Categories))
        UC6((Administer Platform Feedback))
        UC7((Access Platform Analytics))
        UC8((Oversee Shelter Adoptions))

        UC9((View Personal Profile))
        UC10((Register Pet for Adoption))
        UC11((Search & Filter Pets Catalog))
        UC12((Toggle Lost Pet SOS Alert))
        UC13((Generate QR Collar Tag))
        UC14((Scan Collar QR & Contact))
        UC15((View Safety Guidelines))
        UC16((Save Favorite Pets))
        UC17((Report Inappropriate Listing))

        UC1 -.->|<<include>>| UC9
        UC2 -.->|<<include>>| UC10
        UC3 -.->|<<include>>| UC11
        UC4 -.->|<<include>>| UC12
        UC10 -.->|<<extend>>| UC13
        UC13 -.->|<<extend>>| UC14
    end

    Admin[Admin]
    SubAdmin[Moderator / Sub-Admin]
    User[Pet Owner / Adopter]

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8

    SubAdmin -.-> UC2
    SubAdmin -.-> UC3
    SubAdmin -.-> UC4
    SubAdmin -.-> UC6

    User --> UC9
    User --> UC10
    User --> UC11
    User --> UC12
    User --> UC13
    User --> UC14
    User --> UC15
    User --> UC16
    User --> UC17
```


## 3.3 Sequence Diagram

The Sequence Diagram captures the chronological sequence of messages and interactions exchanged between system lifelines during critical Petaverse user workflows.

### Lifelines & Participants:
1. **Pet Owner (Actor):** End user initiating actions.
2. **Web UI (Presentation Layer):** React 18 single-page application handling forms and local state.
3. **API Server (Application Layer):** Express.js / Node.js backend executing route handlers and middleware validation.
4. **Database Services (Data Layer):**
   - **Auth DB:** MongoDB user credentials and JWT validation.
   - **Pet DB:** Pet profiles, breeds, age, and health records.
   - **Media & SOS DB:** Cloudinary image URLs and real-time Lost Pet beacon registries.

### Workflows Modeled:
- **Flow 1: User Login & JWT Authentication:** User submits credentials -> Backend validates hash -> Returns JWT bearer token -> UI initializes session dashboard.
- **Flow 2: Pet Registration & Collar QR Tag Generation:** User submits multipart pet data -> Backend persists entity and computes QR code hash -> Returns `201 Created` with QR Tag modal payload.
- **Flow 3: Lost Pet SOS Community Alerting:** User toggles SOS switch -> Backend transitions pet status to `lost` and activates public contact beacon -> UI displays urgent alert banner.

- High-Res Diagram: `docs/blackbook/3.3_Sequence_Diagram.png`
- Vector SVG: `docs/blackbook/3.3_Sequence_Diagram.svg`

---

## 3.4 Class Diagram

The Class Diagram defines the structural object model of Petaverse, outlining class attributes, operational methods, access visibility (`+` public, `-` private), inheritance hierarchies, and multiplicities.

### Core Classes & Associations:
1. **User (Superclass):** Encapsulates core identity properties (`userId`, `name`, `email`, `password`, `role`).
2. **Admin & Shelter_Manager (Specializations):** Inherit from `User` to add operational and governance privileges.
3. **Pet:** Central entity representing pet profiles (`name`, `species`, `listingType`, `isLost`). Associated with `User` with cardinality `1 : *`.
4. **MedicalRecord:** Tracks vaccination dates and vet details. Connected to `Pet` with cardinality `1 : *`.
5. **Report:** Handles community flags for duplicate or inappropriate posts (`1 : *` with User).
6. **SavedPet:** Represents user favorites / wishlists (`1 : *` with User).
7. **AdoptionInquiry:** Manages adoption requests submitted by potential adopters (`1 : *` with User).

- High-Res Diagram: `docs/blackbook/3.4_Class_Diagram.png`
- Vector SVG: `docs/blackbook/3.4_Class_Diagram.svg`

---

## 3.7 Object Diagram

The Object Diagram illustrates a snapshot of runtime object instances, attribute values, and link associations in Petaverse at a specific point in time.

### Concrete Instances Depicted:
- `admin1 : Admin` (Super Admin Raj, ID: A101)
- `user1 : PetOwner` (Registered pet parent Amit Sharma, ID: U201)
- `pet1 : Pet` (Registered Golden Retriever "Bruno", ID: PT401)
- `tag1 : CollarQRCode` (Active Collar QR tag linked to Bruno, ID: QR501)
- `sos1 : LostAlert` (Standby safety beacon for Bruno in Andheri, Mumbai, ID: S601)
- `perm1 : Permission` (Pet SOS & Safety module access granted to admin1, ID: P701)
- `report1 : ModerationReport` (Community duplicate listing report assigned for review, ID: R301)

- High-Res Diagram: `docs/blackbook/3.7_Object_Diagram.png`
- Vector SVG: `docs/blackbook/3.7_Object_Diagram.svg`
