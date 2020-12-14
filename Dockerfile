FROM golang:1.15

# Set the Current Working Directory inside the container
WORKDIR $GOPATH/src/github.com/koho/takehome/velocitylimit

# Install git
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

# Clone source code
RUN git clone https://github.com/gitusernamegit/go-velocity-limit.git

RUN mkdir -p $GOPATH/src/github.com/koho/takehome/velocitylimit

WORKDIR $GOPATH/src/github.com/koho/takehome/velocitylimit/go-velocity-limit/
COPY . ../../

WORKDIR $GOPATH/src/github.com/koho/takehome
RUN rm -rf go-velocity-limit

# Download all the dependencies
RUN go get -d -v ./...

# Install the package
RUN go install -v ./...

RUN go build -o main .

# Install the node
FROM node:15.4.0

# Install react packages
WORKDIR $GOPATH/src/github.com/koho/takehome/velocitylimit/frontend
RUN npm install typescript @types/node @types/react @types/react-dom @types/jest react-scripts@4.0.1 react-redux @types/react-redux @types/redux redux-thunk @types/redux-thunk --silent -D
RUN npm run build

COPY build ../backend/

# This container exposes port 8092 to the outside world
EXPOSE 8092

FROM golang:1.15
# Run the executable
WORKDIR $GOPATH/src/github.com/koho/takehome/velocitylimit/
CMD ["go", "run", "main.go"]