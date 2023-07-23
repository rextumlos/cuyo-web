'use client'


const smartContractHook = (contract) => {
    // User api calls
    // getters
    const measureTransactionTime = async (txPromise) => {
        const startTime = performance.now(); // Record start time

        try {
            const tx = await txPromise;
            const endTime = performance.now(); // Record end time
            const transactionTime = endTime - startTime; // Calculate transaction time
            console.log('Transaction Time:', transactionTime, 'ms');
            return tx;
        } catch (error) {
            console.log(error);
        }
    };

    const setAHouseholdDemand = async (account, demand) => {
        try {
            const demandInInt = BigInt(demand * 10 ** 3)
            const tx = contract.methods.set_household_demand(account, demandInInt).send({ from: account })

            return measureTransactionTime(tx);
        } catch (error) {
            console.log(error)
        }
    }

    const updateGeneration = async (account, newGeneration) => {
        try {
            const newGenerationInInt = BigInt(newGeneration) * BigInt(10 ** 3);
            console.log(newGenerationInInt)
            const tx = contract.methods.update_generation(newGenerationInInt).send({ from: account })

            return measureTransactionTime(tx);
        } catch (error) {
            console.log(error)
        }
    }

    const updateStorageCapacity = async (account, newCapacity) => {
        try {
            const newCapacityInInt = BigInt(newCapacity) * BigInt(10 ** 3);
            console.log(newCapacityInInt)
            const tx = contract.methods.update_storage_capacity(newCapacityInInt).send({ from: account })

            return measureTransactionTime(tx);
        } catch (error) {
            console.log(error)
        }
    }

    const resetMicrogrid = async (account) => {
        try {
            const tx = contract.methods.reset_microgrid().send({ from: account })
            return measureTransactionTime(tx);
        } catch (error) {
            console.log(error)
        }
    }

    const getGridInfo = async (account) => {
        try {
            const tx = await contract.methods.get_grid_info().call({ from: account })
            return measureTransactionTime(tx);
        } catch (error) {
            console.log(error)
        }
    }

    const getGridTests = async (account) => {
        try {
            const tx = await contract.methods.get_tests().call({ from: account })
            return measureTransactionTime(tx);
        } catch (error) {
            console.log(error)
        }
    }

    return {
        setAHouseholdDemand,
        resetMicrogrid,
        getGridInfo,
        getGridTests,
        updateGeneration,
        updateStorageCapacity
    }
}

export default smartContractHook