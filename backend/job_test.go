package main

import (
	"testing"
)

type mockLoadService struct {
}

func (service mockLoadService) load(customerLoad *CustomerLoad) {
}

func TestCustomerLoadProcessingOrder(t *testing.T) {

	service := mockLoadService{}
	customerIDs := []int64{1, 2, 3, 4, 5}
	loadsPerCustomer := 10
	loads := generateCustomerLoads(customerIDs, loadsPerCustomer)

	scheduleLoads(loads, service)

	//Most recent proceessed order load ID per customer
	loadIDCustomerIDMap := make(map[int64]int64)

	for _, load := range loads {
		if loadIDCustomerIDMap[load.CustomerID] > load.ID {
			t.Errorf("Customer %d load order violated, got: %d, want: %d.", load.CustomerID, loadIDCustomerIDMap[load.CustomerID], load.ID)
		}

		loadIDCustomerIDMap[load.CustomerID] = load.ID
	}
}

func generateCustomerLoads(customerIDs []int64, loadsPerCustomer int) []CustomerLoad {

	var customerLoads []CustomerLoad
	loadID := int64(1)
	for i := 0; i < loadsPerCustomer; i++ {
		loadID++
		for customerID := range customerIDs {
			customerLoads = append(customerLoads, CustomerLoad{ID: loadID, CustomerID: int64(customerID), Amount: usdCurrencyMinimumAmount()})
		}
	}

	return customerLoads
}
