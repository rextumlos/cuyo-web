"use client";
import Admin from "@/components/Admin";
import Navbar from "@/components/Navbar";
import User from "@/components/User";
import smartContractHook from "@/hooks/smartContractHook";
import { useEffect, useState } from "react";
const Home = ({ account, balance, contract, web3 }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { setAHouseholdDemand } = smartContractHook(contract);

  const ADMIN_ACCOUNT = process.env.NEXT_PUBLIC_ADMIN_ACCOUNT;

  const handleSubmit = async (formValues) => {
    setIsLoading(true);
    try {
      console.log(formValues.demand);
      await setAHouseholdDemand(account, formValues.demand);
      setTimeout(() => {
        setIsSubmit(true);
        setIsLoading(false);
      }, 1500);
    } catch (error) {}
  };

  useEffect(() => {
    if (account === ADMIN_ACCOUNT) setIsAdmin(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    console.log(account);
  }, [account]);

  return (
    <>
      <Navbar account={account} />
      <div className="flex justify-center items-center">
        {isAdmin ? (
          <Admin account={account} contract={contract} isLoading={isLoading} />
        ) : (
          <User
            account={account}
            contract={contract}
            isLoading={isLoading}
            isSubmit={isSubmit}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </>
  );
};

export default Home;
