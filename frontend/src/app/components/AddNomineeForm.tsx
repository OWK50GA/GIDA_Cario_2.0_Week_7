import { useState } from "react";
import GenericModal from "./internal/util/GenericModal";
import {
  useAccount,
  useContract,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";
import { VotingAbi } from "../common/abis/votingAbi";
import { ContractAddress } from "../common/data";
import { CallData } from "starknet";
import Loading from "./internal/util/Loading";

export default function AddNominee() {
  const [candidateFirstname, setCandidateFirstName] = useState("");
  const [candidateLastname, setCandidateLastName] = useState("");

  const { address: user } = useAccount();

  const { contract } = useContract({
    abi: VotingAbi,
    address: ContractAddress,
  });

  const {
    writeAsync,
    error,
    isError: writeIsError,
    isPending,
    data,
  } = useContractWrite({
    calls: [],
  });

  const {
    isError: nominationWaitIsError,
    data: nominationWaitData,
    isPending: nominationIsPending,
    isLoading: nominationWaitIsLoading,
  } = useWaitForTransaction({
    hash: data?.transaction_hash,
    watch: true,
  });

  const togglePopover = ({ targetId }: { targetId: string }) => {
    const popover = document.getElementById(targetId);
    // @ts-ignore
    popover?.togglePopover();
    if (popover) {
      popover.addEventListener("toggle", () => {
        if (popover.matches(":popover-open")) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      });
    }
  };

  const nominateCandidate = async () => {
    if (!user || !contract || !candidateFirstname || !candidateLastname) return;

    try {
      const call = await contract.populate(
        "nominate",
        CallData.compile([candidateFirstname, candidateLastname]),
      );
      await writeAsync({ calls: [call] });
      togglePopover({ targetId: "transaction-modal" });
    } catch (err) {
      console.error(err);
    }
  };

  const LoadingState = ({ message }: { message: any }) => (
    <span>
      {message}
      <Loading />
    </span>
  );

  const buttonContent = () => {
    if (isPending) return <LoadingState message={"Sending"} />;
    if (nominationWaitIsLoading)
      return <LoadingState message={"Waiting for Confirmation"} />;
    if (nominationWaitData && nominationWaitData.isReverted())
      return <LoadingState message={"Transaction Reverted"} />;
    if (nominationWaitData && nominationWaitData.isRejected())
      return <LoadingState message={"Transaction Rejected"} />;
    if (nominationWaitData && nominationWaitData.isError())
      return <LoadingState message={"Unexpected error occurred"} />;
    if (nominationWaitData) return "Transaction Confirmed";

    return "Nominate Student";
  };

  return (
    <form
      className="rounded-lg border border-gray-200 px-16 py-8"
      onSubmit={(e) => {
        e.preventDefault();
        nominateCandidate();
      }}
    >
      <h2 className="text-xl">Add Nominee Form</h2>

      <div className="mt-5 flex flex-col justify-center gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="candidate-firstname">Candidate FirstName</label>
          <span className="rounded-md border border-gray-500 px-4 py-2">
            <input
              id="candidate-firstname"
              type="text"
              className="w-full outline-none"
              value={candidateFirstname}
              onChange={(e) => setCandidateFirstName(e.target.value)}
            />
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="candidate-lastname">Candidate LastName</label>
          <span className="rounded-md border border-gray-500 px-4 py-2">
            <input
              id="candidate-lastname"
              type="text"
              className="w-full outline-none"
              value={candidateLastname}
              onChange={(e) => setCandidateLastName(e.target.value)}
            />
          </span>
        </div>
      </div>

      <div className="mt-5 w-full">
        <button
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          type="submit"
          disabled={!candidateFirstname || !candidateLastname || isPending}
        >
          {buttonContent()}
        </button>
      </div>
    </form>
  );
}

// import { FormEvent, FormEventHandler, useMemo, useState } from "react";
// import GenericModal from "./internal/util/GenericModal";
// import {
//   useAccount,
//   useContract,
//   useContractWrite,
//   useWaitForTransaction,
// } from "@starknet-react/core";
// import { VotingAbi } from "../common/abis/votingAbi";
// import { ContractAddress } from "../common/data";
// import { CallData } from "starknet";
// import Loading from "./internal/util/Loading";
// import { useForm } from "react-hook-form";

// export default function AddNominee() {
//   const togglePopover = ({ targetId }: { targetId: string }) => {
//     const popover = document.getElementById(targetId);
//     // @ts-ignore
//     popover.togglePopover();
//     if (popover) {
//       popover.addEventListener("toggle", () => {
//         if (popover.matches(":popover-open")) {
//           document.body.style.overflow = "hidden";
//         } else {
//           document.body.style.overflow = "";
//         }
//       });
//     }
//   };

//   const [candidateFirstname, setCandidateFirstName] = useState("");
//   const [candidateLastname, setCandidateLastName] = useState("");

//   const { address: user } = useAccount();

//   const { contract } = useContract({
//     abi: VotingAbi,
//     address: ContractAddress,
//   });

//   const calls = useMemo(() => {
//     const isValid =
//       user &&
//       contract &&
//       candidateFirstname.length > 0 &&
//       candidateLastname.length > 0;

//     if (!isValid) return;

//     return [
//       contract.populate(
//         "nominate",
//         CallData.compile([candidateFirstname, candidateLastname]),
//       ),
//     ];
//   }, [user, candidateFirstname, candidateLastname, contract]);

//   const {
//     writeAsync,
//     error,
//     isError: writeIsError,
//     isPending,
//     data,
//   } = useContractWrite({
//     calls,
//   });

//   const {
//     isError: nominationWaitIsError,
//     data: nominationWaitData,
//     isPending: nominationIsPending,
//     isLoading: nominationWaitIsLoading,
//   } = useWaitForTransaction({
//     hash: data?.transaction_hash,
//     watch: true,
//   });

//   const nominateCandidate = async () => {
//     console.log("Starting the nominate candidate function");
//     try {
//       await writeAsync();
//       togglePopover({ targetId: "transaction-modal" });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const LoadingState = ({ message }: { message: any }) => {
//     return (
//       <span>
//         {message}
//         <Loading />
//       </span>
//     );
//   };

//   const buttonContent = () => {
//     if (isPending) {
//       return <LoadingState message={"Sending"} />;
//     }
//     if (nominationWaitIsLoading) {
//       return <LoadingState message={"Waiting for Confirmation"} />;
//     }
//     if (nominationWaitData && nominationWaitData.isReverted()) {
//       return <LoadingState message={"Transaction Reverted"} />;
//     }
//     if (nominationWaitData && nominationWaitData.isRejected()) {
//       return <LoadingState message={"Transaction Rejected"} />;
//     }
//     if (nominationWaitData && nominationWaitData.isError()) {
//       return <LoadingState message={"Unexpected error occured"} />;
//     }
//     if (nominationWaitData) {
//       return "Transaction Confirmed";
//     }

//     return "Nominate Student";
//   };

//   return (
//     <form
//       action=""
//       className="rounded-lg border border-gray-200 px-16 py-8"
//       // onSubmit={}
//     >
//       <h2 className="text-xl">Add Nominee Form</h2>

//       <div className="mt-5 flex flex-col justify-center gap-4">
//         <div className="flex flex-col gap-2">
//           <label htmlFor="" className="">
//             Candidate FirstName
//           </label>
//           <span className="rounded-md border border-gray-500 px-4 py-2">
//             <input
//               type="text"
//               className="outline-none"
//               value={candidateFirstname}
//               onChange={(e) => {
//                 setCandidateFirstName(e.target.value);
//               }}
//             />
//           </span>
//         </div>
//         <div className="flex flex-col gap-2">
//           <label htmlFor="" className="">
//             Candidate LastName
//           </label>
//           <span className="rounded-md border border-gray-500 px-4 py-2">
//             <input
//               type="text"
//               className="outline-none"
//               value={candidateLastname}
//               onChange={(e) => {
//                 setCandidateLastName(e.target.value);
//               }}
//             />
//           </span>
//         </div>
//       </div>

//       <div className="mx-auto mt-5 w-[100%]">
//         <button
//           className="w-full rounded-md bg-blue-500 px-4 py-2 text-white"
//           type="submit"
//           onClick={(e) => {
//             e.preventDefault();
//             nominateCandidate();
//           }}
//         >
//           {buttonContent()}
//           {/* Add Nominee */}
//         </button>
//       </div>
//     </form>
//   );
// }
