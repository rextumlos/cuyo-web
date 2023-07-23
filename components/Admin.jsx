"use client";

import smartContractHook from "@/hooks/smartContractHook";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Form from "./Form";
import Loading from "./Loading";

const Admin = ({ account, contract, isLoading }) => {
  const [gridInfo, setGridInfo] = useState();
  const [transactions, setTransactions] = useState();
  const [statistics, setStatistics] = useState();
  const [peakDemand, setPeakDemand] = useState();
  const [resetLoading, setResetLoading] = useState(false);
  const [testHistory, setTestHistory] = useState();
  const gridStates = ["Stable", "Warning", "Unstable"];
  const {
    getGridInfo,
    resetMicrogrid,
    getGridTests,
    updateGeneration,
    updateStorageCapacity,
  } = smartContractHook(contract);

  const fetchGridInfo = async () => {
    const result = await getGridInfo(account);
    setGridInfo(result);
  };

  const fetchTransaction = () => {
    const transactions = gridInfo && gridInfo[5];
    if (transactions) {
      const filteredTransactions = transactions.filter(
        (item) => item[0] !== "0x0000000000000000000000000000000000000000"
      );
      setTransactions(filteredTransactions);
    }
  };

  const fetchStatistics = () => {
    let peakDemand = 0;
    let statistics = [];
    transactions.map((transaction, index) => {
      const demand = Number(transaction.demand) / 10 ** 3;
      if (demand > peakDemand) peakDemand = demand;
      statistics.push({
        user: index,
        fromAddress: transaction.fromAddress,
        demand: demand,
      });
    });

    setStatistics(statistics);
    setPeakDemand(peakDemand);
  };

  const fetchGridTests = async () => {
    const result = await getGridTests(account);
    const tests = [];
    result.map((test) => {
      if (test.energy_consumed !== 0n) tests.push(test);
    });

    setTestHistory(tests);
  };

  const handleResetMicrogrid = async () => {
    setResetLoading(true);
    await resetMicrogrid(account);
    setTimeout(() => {
      setResetLoading(false);
    }, 1500);
  };

  const handleUpdateGeneration = async (formValues) => {
    const result = await updateGeneration(account, formValues.newGeneration);
    console.log(formValues.newGeneration);
  };

  const handleUpdateCapacity = async (formValues) => {
    const result = await updateStorageCapacity(account, formValues.newCapacity);
    console.log(result);
  };

  useEffect(() => {
    if (account !== "") fetchGridInfo();
  }, [account]);

  useEffect(() => {
    if (gridInfo !== null) {
      fetchTransaction();
      fetchGridTests();
    }
  }, [gridInfo]);

  useEffect(() => {
    if (transactions && transactions.length > 0) fetchStatistics();
  }, [transactions]);

  return (
    <div className="mx-20 pt-5 flex flex-row justify-center w-[1680px] h-full">
      {isLoading || resetLoading ? (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex flex-row">
            <div className="basis-1/4 bg-slate-100 p-5 mr-3">
              <h1 className="font-bold">Transactions:</h1>
              {gridInfo[5][0][0] !==
              "0x0000000000000000000000000000000000000000" ? (
                <>
                  {gridInfo[5].map((transaction) => {
                    if (
                      transaction.fromAddress !==
                      "0x0000000000000000000000000000000000000000"
                    ) {
                      return (
                        <div className="p-2 m-2">
                          <p>From: {transaction.fromAddress}</p>
                          <p>
                            Demand: {Number(transaction.demand) / 10 ** 3} W
                          </p>
                        </div>
                      );
                    }
                  })}
                </>
              ) : (
                <>
                  <p>No transactions has been created.</p>
                </>
              )}
            </div>
            <div className="basis-3/4 h-full flex flex-col">
              <div className=" bg-slate-100 p-5 flex flex-row mb-3">
                <div className="basis-1/3 mr-2">
                  <div className="flex flex-col mb-6">
                    <h1 className="font-bold">Cuyo Microgrid</h1>
                    {console.log(gridInfo)}
                    <p>Energy Production: {Number(gridInfo[0]) / 10 ** 3} W</p>
                    <p>
                      External energy sources: {Number(gridInfo[2]) / 10 ** 3} W
                    </p>
                    <p>Total users: 10 users</p>
                    <p>Grid stability: {gridStates[Number(gridInfo[4])]}</p>
                  </div>
                  <div className="flex flex-col mb-10">
                    <h1 className="font-bold">Statistics and Analysis</h1>
                    <p>Total demand: {Number(gridInfo[1]) / 10 ** 3} W</p>
                    <p>Peak demand: {peakDemand} W</p>
                    <p>
                      External energy consumed: {Number(gridInfo[3]) / 10 ** 3}{" "}
                      W
                    </p>
                    <p>
                      External energy added:{" "}
                      {Number(gridInfo[6]) !== 10 ? (
                        <>0 W</>
                      ) : (
                        <>
                          {gridInfo[0] > gridInfo[1] ? (
                            <>{(Number(gridInfo[0]) - Number(gridInfo[1])) / 10 ** 3} W</>
                          ) : (
                            <>0 W</>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="basis-2/3">
                  {statistics ? (
                    <>
                      <p className="text-center font-bold">
                        Demand per user {"(W)"}
                      </p>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          width={500}
                          height={300}
                          data={statistics}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="user" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="demand" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className="bg-slate-100 p-5 flex flex-col mb-3">
                <h1 className="font-bold">Admin tools</h1>
                <div className="flex flex-row justify-center space-x-9 mb-5">
                  <Form
                    fields={[
                      {
                        name: "newGeneration",
                        label: "Update energy generation: ",
                        type: "text",
                      },
                    ]}
                    onSubmit={handleUpdateGeneration}
                  />
                  <Form
                    fields={[
                      {
                        name: "newCapacity",
                        label: "Update storage capacity",
                        type: "text",
                      },
                    ]}
                    onSubmit={handleUpdateCapacity}
                  />
                </div>

                <button
                  className="btn btn-primary mx-10"
                  onClick={handleResetMicrogrid}
                >
                  Reset microgrid
                </button>
              </div>

              {testHistory && testHistory !== null ? (
                <>
                  {console.log(testHistory)}
                  <div className="bg-slate-100 p-5">
                    <h1 className="font-bold mb-4">Test history</h1>
                    {testHistory.map((test, index) => {
                      return (
                        <div className="flex flex-col mb-2" key={index}>
                          <p>Test {index}</p>
                          <p>
                            Grid stability:{" "}
                            {gridStates[Number(test.is_grid_stable)]}
                          </p>
                          <p>
                            Energy consumed:{" "}
                            {Number(test.energy_consumed) / 10 ** 3} W
                          </p>
                          <p>
                            Stored energy consumed:{" "}
                            {Number(test.stored_energy_consumed) / 10 ** 3} W
                          </p>
                          <p>
                            Excess energy added:{" "}
                            {Number(test.excess_energy_added) / 10 ** 3} W
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
