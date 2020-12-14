FROM golang:1.15

# Set the Current Working Directory inside the container
WORKDIR $GOPATH/src/github.com/koho/takehome/velocitylimit

# install git
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

# Copy everything from the current directory to the PWD (Present Working Directory) inside the container
RUN git clone https://shorttolong@bitbucket.org/shorttolong/velocitylimit.git

# Download all the dependencies
RUN go get -d -v ./...

# Install the package
RUN go install -v ./...

RUN go build -o main .

# Install the node
FROM node:15.4.0

# Install react packages
WORKDIR $GOPATH/src/github.com/koho/takehome/velocitylimit/frontend
RUN npm install typescript @types/node @types/react @types/react-dom @types/jest react-scripts@4.0.1 react-redux @types/react-redux @types/redux redux-thunk @types/redux-thunk --silent -g
RUN npm run build


# This container exposes port 8080 to the outside world
EXPOSE 8092

# Run the executable
WORKDIR $GOPATH/src/github.com/koho/takehome/velocitylimit/
CMD ["go", "run", "main.go"]