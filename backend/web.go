//Web server
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

//CustomerLoadResponse record ...
type CustomerLoadResponse struct {
	ID         int64 `json:"id,string"`
	CustomerID int64 `json:"customer_id,string"`
	Accepted   bool  `json:"accepted,string"`
}

//CustomerLoad record ...
type CustomerLoad struct {
	Amount string `json:"load_amount"`
	Time   time.Time
	CustomerLoadResponse
}

func parseCustomerLoads(data []byte) ([]CustomerLoad, error) {
	const closingBracket = 125 // '}'

	start := 0
	var loads []CustomerLoad

	for i, b := range data {

		if b == closingBracket {
			binaryLoad := data[start : i+1]

			var load CustomerLoad
			err := json.Unmarshal(binaryLoad, &load)
			if err != nil {
				log.Println(err)
				return nil, err
			}

			loads = append(loads, load)
			start = i + 1
		}
	}

	return loads, nil
}

func toBinaryCustomerLoads(loads []CustomerLoad) []byte {
	var result []byte
	const newLine = 10 // '\n'

	for _, load := range loads {
		res, _ := json.Marshal(load.CustomerLoadResponse)
		result = append(result, res...)
		result = append(result, newLine)
	}

	return result
}

func process(w http.ResponseWriter, r *http.Request) {

	switch r.Method {

	case "POST":

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Fatalln(err)
		}

		loads, err := parseCustomerLoads(body)

		if err != nil || len(loads) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Input is invalid"))
			return
		}

		loadService := getLoadService()
		proccessError := scheduleLoads(loads, loadService)

		if proccessError != nil {
			log.Fatal(proccessError)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Somethning went wrong"))
			return
		}

		w.Write(toBinaryCustomerLoads(loads))

	default:
		fmt.Fprintf(w, "Sorry method not supported.")
	}
}

func runWebServer() {
	http.HandleFunc("/process", process)
	http.Handle("/", http.FileServer(http.Dir("./build")))
	http.ListenAndServe(":8092", nil)
}
