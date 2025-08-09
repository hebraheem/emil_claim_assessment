### Resources

- https://www.youtube.com/watch?v=-pVHnB5n_Xs - short video to understand gRPC

- https://www.youtube.com/watch?v=GHTA143_b-s&t=16s - crash course on nest.js

- https://docs.nestjs.com/microservices/grpc official documentation for gRPC

- https://docs.nestjs.com official documentation for nest.js

---

# 📚 Claims gRPC - REST API

## Services

### ClaimConfigService

| Method            | Request                       | Response                 | Description                  |
| ----------------- | ----------------------------- | ------------------------ | ---------------------------- |
| GetClaimConfig    | `Empty`                       | `ClaimConfigResponseDto` | Get the current claim config |
| UpdateClaimConfig | `ClaimConfigUpdateRequestDto` | `ClaimConfigResponseDto` | Update the claim config      |

---

### ClaimService

| Method      | Request              | Response              | Description                |
| ----------- | -------------------- | --------------------- | -------------------------- |
| CreateClaim | `CreateClaimRequest` | `CreateClaimResponse` | Create a new claim         |
| GetClaim    | `GetClaimRequest`    | `GetClaimResponse`    | Get a claim by ID          |
| GetClaims   | `GetClaimsRequest`   | `GetClaimsResponse`   | List claims (with filters) |
| UpdateClaim | `UpdateClaimRequest` | `UpdateClaimResponse` | Update an existing claim   |
| DeleteClaim | `DeleteClaimRequest` | `DeleteClaimResponse` | Delete a claim             |

---

## Messages

### ClaimConfig

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

### Claim

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

### Claim Service Messages

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

## Usage

- Use a gRPC client (e.g., [grpcurl](https://github.com/fullstorydev/grpcurl), [BloomRPC](https://github.com/bloomrpc/bloomrpc)) or generated client code to call these endpoints.
- All requests and responses are in Protobuf format.

---

## Issue Faced

- Problem with ts-proto:
  - `.ts` files not generated (issue was with `protoc`). Solution: referenced `ts_proto` in the `node_modules`.
  - Copying proto file over to the dist folder (issue: folder setup was incorrect, therefore referenced wrong root path).

---

## Trade Offs

- Do not use any methods from the underlying library/framework (e.g., Express).
- Try as much as possible to use DTOs, especially for validation.

---

## Assumptions

- All currency is in Euro.
- Users are already verified.
- Policy is opened.
- Step one is always fixed.
