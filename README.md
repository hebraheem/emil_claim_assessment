````markdown
# 📚 Claims gRPC - REST API

A monorepo project providing a gRPC-based backend (NestJS) and a React frontend for managing insurance claims.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Authentication](#authentication)
- [Services](#services)
- [Protobuf Messages](#protobuf-messages)
- [Usage](#usage)
- [Scripts](#scripts)
- [Trade Offs](#trade-offs)
- [Assumptions](#assumptions)
- [Test Coverage](#test-coverage)
- [Resources](#resources)
- [Issues Faced](#issues-faced)
- [Steps Cut](#steps-cut)
- [Demo video](#demo-video)

---

## Overview

This project implements a claims management system using gRPC for backend communication and a React-based frontend. It supports claim configuration, creation, retrieval, updating, and deletion, with a focus on modularity and type safety.

---

## Architecture

- **Backend:** NestJS microservices using gRPC and Protobuf for contract-first API development.
- **Frontend:** React (with TypeScript) for the CMS, using Axios for API calls.
- **Database:** Prisma ORM (PostgreSQL or other supported DBs).
- **DevOps:** Docker for local development, GitHub Actions for CI.

---

## Running the App

### 1. Install dependencies
In each app directory (e.g., `api`, `cms`), run:

```bash
cd <app-name>
yarn install   # or npm install

```Example
cd api && npm install
cd cms && npm install

```Quick Start (from root folder)
# For Yarn users
cd api && yarn install && cd ../cms && yarn install && cd ../api && yarn start:app

# For npm users
cd api && npm install && cd ../cms && npm install && cd ../api && npm run start:app

# Running test
```bash
cd <app-name>
yarn test


---

## Authentication

- It's is assumed that user(s) are already verified therefore no authentication module or library was build/used. However the frontend must send a userId in the header as x-userid, this is currently hardcoded on the frontend and backend verifies that the x-userId is in the header otherwise it throws `non-authorize` error.

---

## Services

### ClaimConfigService

| Method            | Request                       | Response                 | Description                  |
| ----------------- | ----------------------------- | ------------------------ | ---------------------------- |
| GetClaimConfig    | `Empty`                       | `ClaimConfigResponseDto` | Get the current claim config |
| UpdateClaimConfig | `ClaimConfigUpdateRequestDto` | `ClaimConfigResponseDto` | Update the claim config      |

### ClaimService

| Method      | Request              | Response              | Description                |
| ----------- | -------------------- | --------------------- | -------------------------- |
| CreateClaim | `CreateClaimRequest` | `CreateClaimResponse` | Create a new claim         |
| GetClaim    | `GetClaimRequest`    | `GetClaimResponse`    | Get a claim by ID          |
| GetClaims   | `GetClaimsRequest`   | `GetClaimsResponse`   | List claims (with filters) |
| UpdateClaim | `UpdateClaimRequest` | `UpdateClaimResponse` | Update an existing claim   |
| DeleteClaim | `DeleteClaimRequest` | `DeleteClaimResponse` | Delete a claim             |

---

## Protobuf Messages

### ClaimConfig

<details>
<summary>Show ClaimConfig Protobuf</summary>

```proto
message Empty {}

message ClaimConfigResponseDto {
  string message = 1;
  bool success = 2;
  int32 status = 3; // HTTP status code
  repeated Steps data = 4;
}

message ClaimConfigUpdateRequestDto {
  repeated Steps request = 1; // List of steps in the claim configuration
  string userId = 2;
}

message Steps {
  string id = 1;
  string title = 2;
  string description = 3;
  map<string, ClaimConfigConfigDto> configs = 4;
  optional bool fixed = 5; // Indicates if the step is fixed and cannot be removed
  optional int32 orderingNumber = 6; // Order of the step in the form
}

message ClaimConfigConfigDto {
  string key = 1;
  string label = 2;
  string type = 3; // e.g., text, number, select, checkbox, radio, textarea, multiselect
  repeated FieldOption options = 4;
  optional string placeholder = 5;
  optional bool required = 6;
  optional string validation = 7; // e.g., regex for validation
  optional string defaultValue = 8; // Default value for the field
  optional int32 orderingNumber = 9; // Order of the field in the form
  optional DependsOn dependsOn = 10; // Key of the field this depends on
}

message FieldOption {
  string value = 1; // The actual value of the option
  string label = 2; // The display label for the option
}

message DependsOn {
  string key = 1; // Key of the field this depends on
  string value = 2; // Values that this field depends on
}
```
````

</details>

### Claim

<details>
<summary>Show Claim Protobuf</summary>

```proto
message Claim {
  int32 claimId = 1;
  string userId = 2;
  string policyId = 3;
  string description = 4;
  string dateOfIncident = 5; // Date of the incident
  string dateOfSubmission = 7; // Date when the claim was reported
  string incidentType = 8; // Type of incident (e.g., theft, accident)
  map<string, string> attributes = 9;
  string status = 10;
  string createdAt = 11; // Timestamp of when the claim was created
  string updatedAt = 12; // Timestamp of when the claim was last updated
  optional string rejectionReason = 13; // Reason for rejection if the claim is rejected
}
```

</details>

### Claim Service Messages

<details>
<summary>Show Claim Service Protobuf</summary>

```proto
message GetClaimsRequest {
  optional int32 page = 1;
  optional int32 pageSize = 2;
  string userId = 3; // ID of the user to filter claims
  string status = 4; // Status of the claims to filter
}

message GetClaimsResponse {
  string message = 1;
  bool success = 2;
  int32 status = 3; // HTTP status code
  repeated Claim claims = 4; // List of claims
  map<string, int32> meta = 5;
}

message GetClaimRequest {
  int32 claimId = 1; // ID of the claim to retrieve
  string userId = 2; // ID of the user requesting the claim
}

message GetClaimResponse {
  string message = 1;
  bool success = 2;
  int32 status = 3; // HTTP status code
  Claim claim = 4; // The retrieved claim object
}

message CreateClaimRequest {
  string userId = 1; // ID of the user creating the claim
  string policyId = 2; // ID of the policy associated with the claim
  string description = 3; // Description of the claim
  map<string, string> attributes = 4; // Additional data for the claim
}

message CreateClaimResponse {
  string message = 1;
  bool success = 2;
  int32 status = 3; // HTTP status code
  int32 claimId = 4; // ID of the created claim
}

message UpdateClaimRequest {
  int32 claimId = 1; // ID of the claim to update
  string userId = 2; // ID of the user updating the claim
  string description = 3; // Updated description of the claim
  map<string, string> attributes = 4; // Updated attributes for the claim
  string status = 5; // Updated status of the claim
}

message UpdateClaimResponse {
  string message = 1;
  bool success = 2;
  int32 status = 3; // HTTP status code
  Claim updatedClaim = 4; // The updated claim object
  map<string, int32> meta = 5; // Additional metadata if needed
}

message DeleteClaimRequest {
  int32 claimId = 1; // ID of the claim to be deleted
  string userId = 2; // ID of the user requesting the deletion
}

message DeleteClaimResponse {
  string message = 1;
  bool success = 2;
  int32 status = 3; // HTTP status code
}
```

</details>

---

## Usage

- Use a gRPC client (e.g., [grpcurl](https://github.com/fullstorydev/grpcurl), [BloomRPC](https://github.com/bloomrpc/bloomrpc)) or generated client code to call these endpoints.
- All requests and responses are in Protobuf format.

- There is currently a database issue when running all application in the container (because i have to user different DATABASE_URL for local testing and in docker container for posgres)- i have provided one script that start the application as follows, run db in docker and FE and BE on physical machine.
  run `cd ../api && yarn start:app` from the root folder.

---

## Scripts

> **Note:** All scripts must be run in the `api` folder except the FE script.

- `yarn docker:up` - Start all services (BE and FE) in Docker
- `yarn docker:down` - Stop all Docker services
- `yarn docker:db` - Run only the database in Docker (BE can run locally)
- `yarn docker:backend` - Run both the database and BE in Docker (FE can run locally)
- `yarn docker:up-no-cache` - Start all services in Docker and clear cache
- `yarn start:all` - Start all BE modules on your machine
- `yarn test` - Run tests (can `cd` to individual project)
- `yarn start` - Start the FE module, `cd` to `cms` before running
- `yarn start:app` - Starts all app BE and FE on local machine and db in docker

---

## Trade Offs

- **No direct use of underlying framework methods:**  
  Avoided using methods from the underlying library/framework (e.g., Express) to keep the codebase portable and decoupled.

- **DTOs for validation:**  
  Used Data Transfer Objects (DTOs) for validation and structure, improving maintainability and type safety at the cost of some boilerplate.

- **Axios for data fetching:**  
  Used plain Axios for frontend data fetching. React Query could offer better caching and performance, but Axios is simpler for current needs.

- **No UI library:**  
  Did not use a UI component library (like MUI, Chakra, or Shadcn UI) to keep the app lightweight, but this means more manual UI work.

- **No form library:**  
  Did not use a form library (like Formik or React Hook Form with Yup), reducing dependencies but making complex form handling more manual.

- **Minimal test**
  Test was only written for important sections of the app.

- **One Repo**
  A single repository is currently used for both the CMS and the widget. However, separating them would improve maintainability and scalability.

---

## Assumptions

- All currency is in Euro.
- Users are already verified.
- Policy is opened.
- Claim information is always fixed.

---

## Test Coverage

> **Test Coverage Report (important functionalities):**

| File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                                                                                   |
| ------------------------------ | ------- | -------- | ------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **All files**                  | 19.25   | 8.4      | 9.5     | 24.75   |                                                                                                                                     |
| apps/api/src                   | 52.63   | 66.21    | 44.44   | 54.54   |                                                                                                                                     |
| ├─ app.controller.ts           | 89.47   | 70       | 100     | 100     | 38-141                                                                                                                              |
| ├─ app.module.ts               | 0       | 100      | 100     | 0       | 1-25                                                                                                                                |
| ├─ app.service.ts              | 37.5    | 100      | 0       | 28.57   | 33-104                                                                                                                              |
| ├─ main.ts                     | 0       | 0        | 0       | 0       | 1-23                                                                                                                                |
| apps/api/src/dtos              | 93      | 50       | 0       | 93      |                                                                                                                                     |
| ├─ claim-config.dto.ts         | 86.66   | 100      | 0       | 86.66   | 38,60,86,102                                                                                                                        |
| ├─ claim.dto.ts                | 95.58   | 50       | 0       | 95.58   | 112,148,185                                                                                                                         |
| ├─ index.ts                    | 100     | 100      | 100     | 100     |                                                                                                                                     |
| apps/api/src/exceptions        | 0       | 0        | 0       | 0       |                                                                                                                                     |
| ├─ http-filter.exception.ts    | 0       | 0        | 0       | 0       | 1-67                                                                                                                                |
| apps/api/src/interceptors      | 0       | 0        | 0       | 0       |                                                                                                                                     |
| ├─ user-id.interceptor.ts      | 0       | 0        | 0       | 0       | 1-24                                                                                                                                |
| apps/api/src/pipes             | 33.33   | 0        | 20      | 27.27   |                                                                                                                                     |
| ├─ grpc-validation.pipe.ts     | 23.52   | 0        | 25      | 18.75   | 21-103                                                                                                                              |
| ├─ index.ts                    | 100     | 100      | 100     | 100     |                                                                                                                                     |
| ├─ user-auth.pipe.ts           | 50      | 0        | 0       | 40      | 15-25                                                                                                                               |
| apps/claims/src                | 59      | 50.9     | 70      | 58.78   |                                                                                                                                     |
| ├─ claims-config.controller.ts | 100     | 75       | 100     | 100     | 16-36                                                                                                                               |
| ├─ claims-config.service.ts    | 100     | 83.33    | 100     | 100     | 67                                                                                                                                  |
| ├─ claims.controller.ts        | 100     | 75       | 100     | 100     | 23-46                                                                                                                               |
| ├─ claims.module.ts            | 0       | 100      | 100     | 0       | 1-20                                                                                                                                |
| ├─ claims.service.ts           | 51.06   | 34.34    | 52.94   | 51.68   | 96,171,262-272,278-279,284-331,339-396                                                                                              |
| ├─ main.ts                     | 0       | 100      | 0       | 0       | 1-26                                                                                                                                |
| apps/claims/src/prisma         | 46.15   | 75       | 0       | 44.44   |                                                                                                                                     |
| ├─ prisma.module.ts            | 0       | 100      | 100     | 0       | 1-14                                                                                                                                |
| ├─ prisma.service.ts           | 75      | 75       | 0       | 66.66   | 40-52                                                                                                                               |
| generated/prisma               | 91.22   | 50       | 0       | 91.22   | 208-218                                                                                                                             |
| generated/prisma/runtime       | 17.68   | 6.83     | 8.02    | 54      | 14,18-22,25-27,38-60,68,72-104,115-116,126-129                                                                                      |
| proto/types/proto              | 4.87    | 0        | 5.12    | 4.87    | ...162-1205,1210-1275,1280-1323,1328-1393,1409-1554,1559-1602,1616-1750,1755-1798,1803-1846,1851-1916,1921-1970,1999-2000,2046-2047 |

---

## Resources

- [gRPC short video](https://www.youtube.com/watch?v=-pVHnB5n_Xs)
- [NestJS crash course](https://www.youtube.com/watch?v=GHTA143_b-s&t=16s)
- [NestJS gRPC docs](https://docs.nestjs.com/microservices/grpc)
- [NestJS docs](https://docs.nestjs.com)
- [grpcurl](https://github.com/fullstorydev/grpcurl) - CLI for gRPC
- [BloomRPC](https://github.com/bloomrpc/bloomrpc) - GUI for gRPC
- GitHub Copilot - for UI design, test/mocks generation, and code auto completion

---

## Issues Faced

- **Problem with ts-proto:**
  - `.ts` files not generated (issue was with `protoc`). Solution: referenced `ts_proto` in the `node_modules`.
  - Copying proto file over to the dist folder (issue: folder setup was incorrect, therefore referenced wrong root path).

---

## Step Cut

- **EMBEDDING** : Deliver as a single JS bundle (Not completely sure how this is done)
- **TESTING** : Minimal test coverage
- **Versioning and A/B toggle** : I was unable to complete this part due to time constraints. However, it can be implemented by extending the DTO with an additional attribute, version. This attribute would be updated each time a change is made,          without overwriting the previous record. Instead, a new version of the claim would be created. As a result, each claim would maintain an array of its versions.

---

## Demo Video

[![Watch the demo](https://cdn.loom.com/sessions/thumbnails/5529f5befa97489684eb2e9b6ec2b58f-with-play.gif)]
https://www.loom.com/share/5529f5befa97489684eb2e9b6ec2b58f?sid=16b9463d-1a32-44b2-bc21-3bb4d0dbf8f1
