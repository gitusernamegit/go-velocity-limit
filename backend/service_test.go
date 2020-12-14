package main

import (
	"fmt"
	"testing"
	"time"
)

func TestDuplicateLoad(t *testing.T) {

	today := time.Now().UTC()
	service := newLoadService()
	loadID, customerID := int64(1), int64(1)
	customerLoad := createCustomerLoad(loadID, customerID, usdCurrencyMinimumAmount(), today)

	customerLoad.ID = loadID
	assertAccepted(true, customerLoad, today, "First load should be accepted", service, t)

	customerLoad.ID = loadID
	assertAccepted(false, customerLoad, today, "Duplicate load should be ignored", service, t)

	customerLoad.ID = loadID + 1
	assertAccepted(true, customerLoad, today, "Second load should be accepted", service, t)
}

func TestCustomerLoadLimitPerDay(t *testing.T) {
	service := newLoadService()
	loadID, customerID := int64(1), int64(1)

	today := time.Now().UTC()
	customerLoad := createCustomerLoad(loadID, customerID, usdCurrencyMinimumAmount(), today)

	for i := 0; i < maximumCustomerLoadsPerDay; i++ {
		assertAccepted(true, customerLoad, today, "Load under the limit per day should be accepted", service, t)
	}

	assertAccepted(false, customerLoad, today, "Load over the limit per day should not be accepted", service, t)

	assertAccepted(true, createCustomerLoad(customerLoad.ID, customerLoad.CustomerID+1, customerLoad.Amount, customerLoad.Time), customerLoad.Time,
		"Daily load limit should not affect remaining customers", service, t)

	assertAccepted(true, customerLoad, today.AddDate(0, 0, 1), "Load under the limit per day(next day) should be accepted", service, t)
}

func TestCustomerAmountLimitPerDay(t *testing.T) {
	service := newLoadService()
	loadID, customerID := int64(1), int64(1)

	startDayDate := time.Now().UTC()
	customerLoad := createCustomerLoad(loadID, customerID, usdCurrencyMinimumAmount(), startDayDate)

	for i := 1; i < maximumCustomerLoadsPerDay; i++ {

		//Split max amount per day into multiple amounts from 1 to maximumLoadsPerDay
		amount := maximumCustomerLoadAmountPerDay / i
		customerLoad.Amount = usdCurrencyAmount(float64(amount))

		for j := 0; j < i; j++ {
			assertAccepted(true, customerLoad, startDayDate.AddDate(0, 0, i), "Amount under the limit per day should be accepted", service, t)
		}

		//Minimum amount to make it over the limit per day
		customerLoad.Amount = usdCurrencyAmount(float64(maximumCustomerLoadAmountPerDay-amount) + minimumLoadAmount)
		assertAccepted(false, customerLoad, startDayDate.AddDate(0, 0, i), "Amount over the limit per day should not be accepted", service, t)

		assertAccepted(true, createCustomerLoad(customerLoad.ID, customerLoad.CustomerID+1, customerLoad.Amount, customerLoad.Time), customerLoad.Time,
			"Daily load amount limit should not affect remaining customers", service, t)
	}
}

func TestCustomerAmountPerWeek(t *testing.T) {
	loadID, customerID := int64(1), int64(1)
	const daysPerWeek = 7
	service := newLoadService()
	today := time.Now().UTC()

	amountPerDay := maximumCustomerLoadAmountPerWeek / daysPerWeek
	startWeekDate, nextStartWeekDate := newStartWeekDateAndNextWeekStartDate(today)
	customerLoad := createCustomerLoad(loadID, customerID, usdCurrencyAmount(float64(amountPerDay)), startWeekDate)

	for i := 0; i < daysPerWeek; i++ {
		assertAccepted(true, customerLoad, startWeekDate.AddDate(0, 0, i), "Amount under the limit per week should be accepted", service, t)
	}

	//Minimum amount to make it over the limit per week
	customerLoad.Amount = usdCurrencyAmount(float64(maximumCustomerLoadAmountPerWeek-amountPerDay*daysPerWeek) + minimumLoadAmount)
	assertAccepted(false, customerLoad, customerLoad.Time, "Amount over the limit per week should not be accepted", service, t)

	assertAccepted(true, createCustomerLoad(customerLoad.ID, customerLoad.CustomerID+1, customerLoad.Amount, customerLoad.Time), customerLoad.Time,
		"Weekly load amount limit should not affect remaining customers", service, t)

	assertAccepted(true, customerLoad, nextStartWeekDate, "Amount under the limit per week(next week) should be accepted", service, t)
}

func TestValidLoadAmount(t *testing.T) {
	loadID, customerID := int64(1), int64(1)
	today := time.Now().UTC()
	service := newLoadService()
	customerLoad := createCustomerLoad(loadID, customerID, usdCurrencyAmount(float64(minimumLoadAmount-0.01)), today)
	assertAccepted(false, customerLoad, customerLoad.Time, fmt.Sprintf("%v%.2f", "Minium load amount should be greater than", minimumLoadAmount), service, t)
}

func assertAccepted(expected bool, customerLoad *CustomerLoad, time time.Time, errorMessage string, service *loadService, t *testing.T) {
	customerLoad.ID++
	customerLoad.Time = time
	service.load(customerLoad)

	if customerLoad.Accepted == !expected {
		t.Errorf("%v, got: %t, want: %t.", errorMessage, customerLoad.Accepted, expected)
	}
}
