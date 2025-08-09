### Resources

- https://www.youtube.com/watch?v=-pVHnB5n_Xs - short video to understand gRPC

- https://www.youtube.com/watch?v=GHTA143_b-s&t=16s - crash course on nest.js

- https://docs.nestjs.com/microservices/grpc official documentation for gRPC

- https://docs.nestjs.com official documentation for nest.js

### issue faced

- problem with ts-proto
  - .ts files not generated (issue was with protoc) - finally used ChatGpt (solution was to reference the ts_proto in the node_module)
  - copying proto file over to the dist folder (issue - folder setup was incorrect therefore reference wrong rootpath)

### Trade offs

- Don not use any methods from the underlying library/frame work (e.g express)
- Try as much as possible to use DTO expecially for validation
