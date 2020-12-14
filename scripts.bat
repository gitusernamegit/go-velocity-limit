docker build --tag velocity_limit:1.0 .
docker run -p 8092:8092/tcp velocity_limit:1.0