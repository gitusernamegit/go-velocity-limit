
# Install the node
FROM node:15.4.0

# Install git
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

# Clone source code
RUN mkdir -p /home/source
WORKDIR /home/source
RUN git clone https://github.com/gitusernamegit/go-velocity-limit.git

WORKDIR /home/source/go-velocity-limit/frontend
RUN npm install react-scripts@4.0.1 typescript @types/node @types/react @types/react-dom @types/jest  react-redux @types/react-redux @types/redux redux-thunk @types/redux-thunk jest -D --silent

# Create production bundle
RUN npm run build

FROM golang:1.15

COPY --from=0 /home/source/go-velocity-limit /home/source/go-velocity-limit

WORKDIR /home/source/go-velocity-limit
ADD backend $GOPATH/src/github.com/koho/takehome/velocitylimit

RUN mkdir -p $GOPATH/src/github.com/koho/takehome/velocitylimit/build
COPY /frontend/build $GOPATH/src/github.com/koho/takehome/velocitylimit/build

WORKDIR $GOPATH/src/github.com/koho/takehome/velocitylimit

# Download all the dependencies
RUN go get -d -v ./...

# Install the package
RUN go install -v ./...

RUN go build -o main .

# This container exposes port 8092 to the outside world
EXPOSE 8092

#CMD ["go", "run", "main.go"]
# Run the executable
CMD ["velocitylimit"]


