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

## 3.5 Activity Diagram

The Activity Diagram models the dynamic operational control flow of the Petaverse portal from initial entry to session logout.

### Mermaid Activity Flowchart Code:

```mermaid
flowchart TD
    Start((● Start))
    Access["Access Petaverse Portal"]
    IsRegistered{"Is User<br/>Registered?"}
    SignUp["Sign Up / Register<br/>(Name, Email, Password)"]
    Login["Login to Account<br/>(Email, Password / Google)"]
    AuthCred["Authenticate Credentials (JWT)"]
    AuthSuccess{"Authentication<br/>Successful?"}
    ShowError["Show Error Message & Prompt Retry"]
    Dashboard["View Petaverse Main Dashboard<br/>(Pet Catalog, QR Tag Status, Lost SOS Beacon)"]

    ForkBar["═══════════════ SYNCHRONIZATION FORK ═══════════════"]

    %% Column 1: Pet Safety & QR Collar Tag
    Col1_Action["Pet Safety & QR Tag Module"]
    Col1_Dec{"Scan or<br/>Generate QR?"}
    Col1_Gen["Download QR Collar Tag Card"]
    Col1_Scan["Scan Collar QR & Contact Owner"]

    %% Column 2: Lost Pet SOS Beacon
    Col2_Action["Lost Pet SOS Beacon Module"]
    Col2_Dec{"Trigger Alert<br/>or View Map?"}
    Col2_Trigger["Activate SOS Beacon Alert (Broadcast)"]
    Col2_View["View Live Lost / Found Listing Map"]

    %% Column 3: Profile & Pet Records
    Col3_Action["Profile & Pet Records Module"]
    Col3_Dec{"Edit Details<br/>or Return?"}
    Col3_Edit["Update Pet & User Profile"]
    Col3_Return["Keep Current Information"]

    %% Column 4: Browse Adoptions
    Col4_Action["Browse Adoptions Catalog"]
    Col4_Filter["Filter by Breed, Species & Location"]
    Col4_Apply["Submit Adoption Inquiry Application"]

    %% Column 5: Community Help & Reports
    Col5_Action["Community Help & Moderation"]
    Col5_Report["Report Inappropriate Listing / Spam"]
    Col5_Track["Track Resolution & Ticket Status"]

    JoinBar["═══════════════ SYNCHRONIZATION JOIN ═══════════════"]

    Logout["Logout / End Session"]
    EndNode(((◎ End)))

    %% Flow Connections
    Start --> Access
    Access --> IsRegistered
    IsRegistered -- "No" --> SignUp
    IsRegistered -- "Yes" --> Login
    SignUp --> AuthCred
    Login --> AuthCred
    AuthCred --> AuthSuccess
    AuthSuccess -- "No" --> ShowError
    ShowError -.-> Login
    AuthSuccess -- "Yes" --> Dashboard
    Dashboard --> ForkBar

    ForkBar --> Col1_Action
    Col1_Action --> Col1_Dec
    Col1_Dec -- "Generate" --> Col1_Gen
    Col1_Dec -- "Scan" --> Col1_Scan
    Col1_Gen --> JoinBar
    Col1_Scan --> JoinBar

    ForkBar --> Col2_Action
    Col2_Action --> Col2_Dec
    Col2_Dec -- "Trigger" --> Col2_Trigger
    Col2_Dec -- "View" --> Col2_View
    Col2_Trigger --> JoinBar
    Col2_View --> JoinBar

    ForkBar --> Col3_Action
    Col3_Action --> Col3_Dec
    Col3_Dec -- "Edit" --> Col3_Edit
    Col3_Dec -- "Return" --> Col3_Return
    Col3_Edit --> JoinBar
    Col3_Return --> JoinBar

    ForkBar --> Col4_Action
    Col4_Action --> Col4_Filter
    Col4_Filter --> Col4_Apply
    Col4_Apply --> JoinBar

    ForkBar --> Col5_Action
    Col5_Action --> Col5_Report
    Col5_Report --> Col5_Track
    Col5_Track --> JoinBar

    JoinBar --> Logout
    Logout --> EndNode
```

### Workflow Stages Modeled:
1. **Entry & Authentication:** Starts at portal load, branches through registration/login verification, handles error handling with retry loops, and transitions to authenticated session state.
2. **Dashboard Synchronization Fork:** A horizontal synchronization fork branches the user's session concurrently into five distinct operational domains:
   - **Pet Safety & QR Collar:** Generating and downloading digital collar cards or scanning stray animal collar tags.
   - **Lost Pet SOS Tracking:** Triggering real-time broadcast beacons or viewing the live lost/found pet community map.
   - **Profile & Pet Management:** Updating personal contact details, medical records, and pet profiles.
   - **Adoption Exploration:** Searching, filtering, and lodging adoption inquiries.
   - **Community Moderation:** Reporting spam or fraudulent listings and tracking resolution tickets.
3. **Session Convergence & Termination:** All branches converge at the join bar leading to explicit logout and final termination.

- High-Res Diagram: `docs/blackbook/3.5_Activity_Diagram.png`
- Vector SVG: `docs/blackbook/3.5_Activity_Diagram.svg`

---

## 3.6 E-R Diagram

The Entity-Relationship (E-R) diagram models the logical data architecture of Petaverse.

### Mermaid ER Diagram Code:

```mermaid
erDiagram
    USER ||--o{ PET : "owns / registers"
    USER ||--|| LOGIN : "authenticates via"
    USER }|--|| ROLE : "assigned"
    ROLE ||--o{ PERMISSION : "contains"
    PET ||--o| COLLAR_QR_TAG : "linked with"
    PET ||--o{ MEDICAL_RECORD : "contains"
    PET ||--o{ ADOPTION_INQUIRY : "receives"
    USER ||--o{ ADOPTION_INQUIRY : "submits"
    PET ||--o{ LOST_SOS_ALERT : "triggers"
    USER ||--o{ REPORT : "files"

    USER {
        string user_id PK
        string user_name
        string user_email
        string user_mobile
        string user_address
        string role
        boolean isActive
    }

    LOGIN {
        string login_id PK
        string login_username
        string user_password
        string login_role_id FK
    }

    ROLE {
        string role_id PK
        string role_name
        string role_desc
    }

    PERMISSION {
        string per_id PK
        string per_role_id FK
        string per_module
        string per_name
    }

    PET {
        string pet_id PK
        string owner_id FK
        string pet_name
        string pet_species
        string pet_breed
        number pet_age
        string pet_gender
        string listingType
        boolean isLost
    }

    COLLAR_QR_TAG {
        string tag_id PK
        string pet_id FK
        string qr_code_hash
        boolean publicContactEnabled
        string tag_status
        number scan_count
    }

    LOST_SOS_ALERT {
        string alert_id PK
        string pet_id FK
        string owner_id FK
        string lastSeenLocation
        string emergencyPhone
        string alert_status
    }

    MEDICAL_RECORD {
        string record_id PK
        string pet_id FK
        string vaccineName
        date dateGiven
        date nextDueDate
        string vetName
        boolean isVerified
    }

    ADOPTION_INQUIRY {
        string inquiry_id PK
        string pet_id FK
        string adopter_id FK
        string inquiry_status
        string inquiry_type
        date request_date
    }

    REPORT {
        string report_id PK
        string reporter_id FK
        string target_id
        string reason
        string status
    }
```

### Entity Sets:
- **User:** Primary identity storing credentials, contact info, and profile records (`#user_id`).
- **Login:** Authentication session credentials (`#login_id`, `login_username`, `user_password`).
- **Roles & Permission:** Role-based access control governing platform privileges (`#role_id`, `#per_id`).
- **Pet:** Core animal profile entity (`#pet_id`, `pet_name`, `pet_species`, `pet_breed`, `pet_age`, `pet_gender`).
- **Adoption:** Formal adoption inquiry linking prospective adopters with listings (`#inquiry_id`).
- **MedicalRecord:** Vaccination histories and veterinary certificates (`#record_id`).
- **CollarQRTag:** Digital collar QR tag metadata and finder contact configurations (`#tag_id`, `qr_code_hash`).

### Relationships:
- **Has:** Connects `User` with `Login` credentials, assigned `Roles`, and operational `Permission` sets.
- **Manage:** Primary enterprise relationship connecting authenticated users with pet profiles, adoption workflows, collar QR tags, and medical records.

- High-Res Diagram: `docs/blackbook/3.6_ER_Diagram.png`
- Vector SVG: `docs/blackbook/3.6_ER_Diagram.svg`

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


## 3.8 Data Dictionary

### 1. User Collection (`users`)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `_id` (PK) | ObjectId | Unique identifier for user account |
| `name` | String | Full name of pet parent or administrator |
| `email` | String (Unique) | User email address used for login and notifications |
| `password` | String | Bcrypt salted encrypted password hash |
| `role` | String (Enum) | User role: 'user' \| 'admin' |
| `phone` | String | Contact phone number for lost pet finder calls |
| `location` | String | City and address of registered pet owner |
| `isActive` | Boolean | Account active / suspension status flag |
| `createdAt` | Date | Account creation timestamp |

### 2. Pet Collection (`pets`)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `_id` (PK) | ObjectId | Unique identifier for pet listing |
| `ownerId` (FK) | ObjectId | Reference to User who registered the pet |
| `name` | String | Pet's registered name |
| `species` | String (Enum) | Species: 'dog', 'cat', 'bird', 'rabbit', 'other' |
| `breed` | String | Specific breed identifier |
| `age` | Number | Age value of the pet |
| `ageUnit` | String (Enum) | Age unit: 'days', 'weeks', 'months', 'years' |
| `gender` | String (Enum) | Gender: 'male', 'female', 'unknown' |
| `listingType` | String (Enum) | Type: 'adoption', 'rehoming', 'safety', 'lost', 'found' |
| `status` | String (Enum) | Listing status: 'available', 'pending', 'adopted', 'resolved' |
| `photos` | Array<Object> | Cloudinary media image objects (url, public_id) |
| `isLost` | Boolean | Active Lost Pet SOS beacon alert flag |

### 3. Collar QR Tag Collection (`qr_tags`)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `_id` (PK) | ObjectId | Unique identifier for QR collar tag |
| `petId` (FK) | ObjectId | Reference to Pet linked to this tag |
| `qrHash` | String (Unique) | Cryptographic hash code encoded in the QR tag |
| `publicContactEnabled` | Boolean | Whether scanning displays owner contact details |
| `emergencyNote` | String | Critical medical or behavioral guidance for finders |
| `scanCount` | Number | Total counter of tag scans |
| `lastScannedAt` | Date | Timestamp of latest collar tag scan |

### 4. Lost Pet SOS Alert Collection (`sos_alerts`)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `_id` (PK) | ObjectId | Unique identifier for SOS alert instance |
| `petId` (FK) | ObjectId | Reference to Pet missing |
| `ownerId` (FK) | ObjectId | Reference to User who triggered the SOS |
| `lastSeenLocation` | String | Address or landmark where pet was last seen |
| `emergencyPhone` | String | Direct hotline contact for finders |
| `reward` | Number | Optional reward offered for pet return |
| `status` | String (Enum) | Alert status: 'active_lost' \| 'found' \| 'resolved' |

### 5. Medical Record Collection (`medical_records`)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `_id` (PK) | ObjectId | Unique identifier for vaccination / health log |
| `petId` (FK) | ObjectId | Reference to Pet receiving care |
| `vaccineName` | String | Name of vaccine administered (e.g. Rabies, DHPP) |
| `dateGiven` | Date | Date vaccine was administered |
| `nextDueDate` | Date | Scheduled booster or next checkup date |
| `vetName` | String | Name of treating veterinarian or clinic |
| `isVerified` | Boolean | Verification status confirmed by shelter moderator |

### 6. Adoption Inquiries & Reports Collection
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `_id` (PK) | ObjectId | Unique identifier for inquiry or report |
| `petId` (FK) | ObjectId | Target pet listing |
| `applicantId` (FK) | ObjectId | User submitting inquiry or incident report |
| `type` | String (Enum) | Record type: 'adoption_inquiry' \| 'abuse_report' |
| `message` | String | Application cover letter or violation description |
| `status` | String (Enum) | Status: 'pending' \| 'approved' \| 'resolved' \| 'dismissed' |
| `submittedAt` | Date | Submission timestamp |
