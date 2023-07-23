import Form from "./Form";
import Loading from "./Loading";
const User = ({ account, contract, isSubmit, isLoading, handleSubmit }) => {
  return (
    <div className="w-[1680px] h-[720px] p-5 flex justify-center items-center">
      {isLoading ? (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          {isSubmit ? (
            <>
            You have successfully input your energy demand!
            </>
          ) : (
            <>
              <Form
                fields={[
                  {
                    name: "demand",
                    label: "Enter your energy demand",
                    type: "text",
                  },
                ]}
                onSubmit={handleSubmit}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default User;
