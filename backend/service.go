//Application logic and db transactions
package main

import (
	"fmt"
	"math/rand"
	"strconv"
	"sync"
	timeUtil "time"
)

const (
	maximumCustomerLoadsPerDay               = 3
	maximumCustomerLoadAmountPerDay          = 5000
	maximumCustomerLoadAmountPerWeek         = 20000
	minimumLoadAmount                float64 = 0.1
	usdCurrency                              = "$"
)

type iLoadService interface {
	load(customerLoad *CustomerLoad)
}

type loadService struct {
	repository       *dbRepository
	transactionMutex *sync.Mutex
}

var (
	once     sync.Once
	instance *loadService
)

func newLoadService() *loadService {
	return &loadService{repository: newDbRepository(), transactionMutex: &sync.Mutex{}}
}

//Service singleton
func getLoadService() *loadService {

	once.Do(func() {
		instance = newLoadService()
	})

	return instance
}

func (service loadService) isAcceptedLimit(customerID int64, amount float64, time timeUtil.Time) bool {

	return service.isAcceptedDailyLoadsCount(customerID, amount, time) &&
		service.isAcceptedDailyLoadBalance(customerID, amount, time) &&
		service.isAcceptedWeeklyLoadBalance(customerID, amount, time)
}

func (service loadService) isAcceptedDailyLoadsCount(customerID int64, amount float64, time timeUtil.Time) bool {

	startDayDate, nextDayDate := newStartDayDateAndNextDayStartDate(time)
	totalLoads := service.repository.GetTotalLoads(customerID, startDayDate, nextDayDate)

	return totalLoads < maximumCustomerLoadsPerDay
}

func (service loadService) isAcceptedDailyLoadBalance(customerID int64, amount float64, time timeUtil.Time) bool {

	startDayDate, nextDayDate := newStartDayDateAndNextDayStartDate(time)
	currentDayLoadTotalAmount := service.repository.GetLoadAmount(customerID, startDayDate, nextDayDate)

	return currentDayLoadTotalAmount+amount <= maximumCustomerLoadAmountPerDay
}

func (service loadService) isAcceptedWeeklyLoadBalance(customerID int64, amount float64, time timeUtil.Time) bool {

	startWeekDate, nextStartWeekDate := newStartWeekDateAndNextWeekStartDate(time)
	currentWeekLoadTotalAmount := service.repository.GetLoadAmount(customerID, startWeekDate, nextStartWeekDate)

	return currentWeekLoadTotalAmount+amount <= maximumCustomerLoadAmountPerWeek
}

func (service loadService) load(customerLoad *CustomerLoad) {

	customerLoad.Accepted = false
	loadAmount := float64(0)
	IsValid := false

	//Assume should ignore invalid loads and conitnue
	if IsValid, loadAmount = isValidLoad(customerLoad); IsValid == false {
		return
	}

	//Lock for db record update within transaction
	defer service.transactionMutex.Unlock()
	service.transactionMutex.Lock()

	if service.repository.hasLoadID(customerLoad.ID, customerLoad.CustomerID) {
		return
	}

	var accepted = service.isAcceptedLimit(customerLoad.CustomerID, loadAmount, customerLoad.Time)
	service.repository.Load(customerLoad.ID, customerLoad.CustomerID, loadAmount, customerLoad.Time, accepted)
	//simulateDBCallDelay()
	customerLoad.Accepted = accepted
}

func isValidLoad(customerLoad *CustomerLoad) (bool, float64) {

	isValid := customerLoad.ID > 0 && customerLoad.CustomerID > 0 && customerLoad.Amount != ""

	if isValid {
		var err error
		loadAmount, err := parseAmount(customerLoad.Amount)

		if err == nil && loadAmount >= minimumLoadAmount {
			return true, loadAmount
		}
	}

	return false, 0
}

func simulateDBCallDelay() {
	n := rand.Intn(10)
	timeUtil.Sleep(timeUtil.Duration(n) * timeUtil.Millisecond)
}

func parseAmount(amountAndCurrency string) (float64, error) {
	amount, err := strconv.ParseFloat(amountAndCurrency[1:], 64)
	return amount, err
}

func newStartDayDateAndNextDayStartDate(time timeUtil.Time) (timeUtil.Time, timeUtil.Time) {
	startDayDate := timeUtil.Date(time.Year(), time.Month(), time.Day(), 0, 0, 0, 0, timeUtil.UTC)
	nextDayStartDate := startDayDate.Add(timeUtil.Hour * 24)
	return startDayDate, nextDayStartDate
}

func newStartWeekDateAndNextWeekStartDate(time timeUtil.Time) (timeUtil.Time, timeUtil.Time) {
	startWeekDate := timeUtil.Date(time.Year(), time.Month(), time.Day(), 0, 0, 0, 0, timeUtil.UTC).AddDate(0, 0, -(int(time.Weekday())+6)%7)
	nextStartWeekDate := startWeekDate.AddDate(0, 0, 7)
	return startWeekDate, nextStartWeekDate
}

func usdCurrencyMinimumAmount() string {
	return fmt.Sprintf("%v%.2f", usdCurrency, minimumLoadAmount)
}

func usdCurrencyAmount(amount float64) string {
	return fmt.Sprintf("%v%.2f", usdCurrency, amount)
}
