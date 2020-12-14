//Loads distribution and processing job
package main

import (
	"sync"
)

func scheduleLoads(loads []CustomerLoad, loadService iLoadService) error {
	customerChannelMap := make(map[int64]chan *CustomerLoad)

	var wg sync.WaitGroup

	for i := range loads {

		customerLoad := &loads[i]
		if customerQueue, ok := customerChannelMap[customerLoad.CustomerID]; ok {
			customerQueue <- customerLoad
		} else {
			wg.Add(1)
			customerQueue := make(chan *CustomerLoad)
			customerChannelMap[customerLoad.CustomerID] = customerQueue
			go processCustomerLoad(customerQueue, loadService, &wg)
			customerQueue <- customerLoad
		}
	}

	for _, queue := range customerChannelMap {

		queue <- nil
	}

	wg.Wait()

	return nil //TODO: Add error handling
}

func processCustomerLoad(customerQueue chan *CustomerLoad, loadService iLoadService, wg *sync.WaitGroup) {
	defer wg.Done()

	for {
		customerLoad := <-customerQueue

		if customerLoad == nil {
			return
		}

		loadService.load(customerLoad)
	}
}
