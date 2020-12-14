//In-memory DB
package main

import (
	"time"
)

type customerLoadDbRecord struct {
	ID         int64
	CustomerID int64
	Amount     float64
	Time       time.Time
	Accepted   bool
}

type dbRepository struct {
	records []customerLoadDbRecord
}

func newDbRepository() *dbRepository {
	var repository dbRepository
	return &repository
}

func (repository *dbRepository) GetLoadAmount(customerID int64, startDate time.Time, endDate time.Time) float64 {
	var acceptedLoadAmount float64

	for _, r := range repository.records {
		if r.CustomerID == customerID && r.Accepted && equalOrAfter(r.Time, startDate) && r.Time.Before(endDate) {
			acceptedLoadAmount += r.Amount
		}
	}

	return acceptedLoadAmount
}

func (repository *dbRepository) GetTotalLoads(customerID int64, startDate time.Time, endDate time.Time) int {
	totalLoads := 0

	for _, r := range repository.records {
		if r.CustomerID == customerID && r.Accepted && equalOrAfter(r.Time, startDate) && r.Time.Before(endDate) {
			totalLoads++
		}
	}

	return totalLoads
}

func (repository *dbRepository) Load(ID int64, customerID int64, amount float64, time time.Time, accepted bool) {
	var record customerLoadDbRecord

	record.ID = ID
	record.CustomerID = customerID
	record.Amount = amount
	record.Time = time
	record.Accepted = accepted

	repository.records = append(repository.records, record)
}

func (repository *dbRepository) hasLoadID(ID int64, customerID int64) bool {

	for _, r := range repository.records {
		if r.ID == ID && r.CustomerID == customerID {
			return true
		}
	}

	return false
}

func equalOrAfter(time1 time.Time, time2 time.Time) bool {
	return time1.Equal(time2) || time1.After(time2)
}
