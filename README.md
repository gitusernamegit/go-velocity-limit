
#Run app using docker

Make sure docker is installed on your machine and running Linux distribution

"run-app.bat" will create new docker image and will run the app


#Run app from local directory

Make sure npm and go are installed on your machine

git clone https://github.com/gitusernamegit/go-velocity-limit.git

Run cli from ~/frontend directory:

npm install react-scripts@4.0.1 typescript @types/node @types/react @types/react-dom jest@26.6.0 @types/jest react-redux @types/react-redux @types/redux redux-thunk @types/redux-thunk -D --silent

npm run build


This should create production ready web bundle "build" directory

Copy "build" directory into ~/backend folder


Create $GOPATH/src/github.com/koho/takehome/velocitylimit

Copy backend folder content into $GOPATH/src/github.com/koho/takehome/

Make $GOPATH/src/github.com/koho/takehome/ your current folder


Run cli: go build

It should create velocitylimit executable

Run velocitylimit

#Run tests

Backend
From ~/backend dorectory run "run-tests.bat"  
or 
From $GOPATH/src/github.com/koho/takehome/velocitylimit cli: go test

Frontend
From ~/frontend directory run cli: npm test


#Web App

The web app should be avaialbe at http://localhost:8092

