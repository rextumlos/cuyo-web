"use client";

import Loading from "@/components/Loading";

const Welcome = ({connectToBlockchain, isLoading}) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="container h-full flex flex-row">
        <div className="basis-3/5 flex items-center">
          <h1 className="text-[50px] ml-6">
            Welcome to Cuyo Island's Energy Management System!
          </h1>
        </div>
        <div className="basis-2/5 flex flex-col justify-center items-center">
          {isLoading ? (
            <>
              <Loading />
              <p>Loading...</p>
            </>
          ) : (
            <>
              <p className="text-2xl mb-10">Energy Management System</p>
              <button className="btn btn-primary" onClick={connectToBlockchain}>
                Log in with Metamask
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
