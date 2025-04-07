'use client'

import { useSearchParams } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import GenericModal from "./internal/util/GenericModal";
import AddNominee from "./AddNomineeForm";
import { Candidates } from "../common/data";
import TableHeader from "./TableHeader";
import TableControls from "./TableControls";

export default function Table(){

    const searchParams = useSearchParams()

    // TODO - Implement Search Functionality
    const page = searchParams.get("page") || 1;

    const from = (Number(page) - 1) * 5 // 5 is the page size
    const to = Number(page) * 5

    const togglePopover = ({ targetId }: { targetId: string }) => {
        const popover = document.getElementById(targetId);
        // @ts-ignore
        popover.togglePopover();
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

    return (
        <div className="w-full mx-auto px-12 py-12">
            
            <TableHeader candidates={Candidates} />

            <div className="overflow-x-auto mt-10 rounded-lg">
                <table className="min-w-full table-auto rounded-lg">
                    <thead className="bg-gray-300 text-gray-700 font-medium">
                        <tr className="font-bold">
                            <td className="py-4 px-4">S/N</td>
                            <td className="py-4 px-4 tracking-wider whitespace-nowrap capitalize">Candidate Surname</td>
                            <td className="py-4 px-4 tracking-wider whitespace-nowrap capitalize">Candidate Firstname</td>
                            <td className="py-4 px-4 tracking-wider whitespace-nowrap capitalize">Number of Votes</td>
                            <td className="py-4 px-4 tracking-wider whitespace-nowrap capitalize">Qualification Status</td>
                            <td className="py-4 px-4 tracking-wider whitespace-nowrap capitalize">Vote</td>
                            {/* <th className="py-4 px-4 tracking-wider whitespace-nowrap capitalize">Disqualify</th> */}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {
                            Candidates.slice(from, to).map((candidate, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="py-4 px-4">{candidate.id}</td>
                                        <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap">{candidate.surname}</td>
                                        <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap">{candidate.firstname}</td>
                                        <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap">{candidate.noOfVotes}</td>
                                        <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap">
                                            {
                                                candidate.qualified? 
                                                    <div className="rounded-full bg-green-500 text-white w-fit px-1 py-1">
                                                        <FaCheck />
                                                    </div> 
                                                    :
                                                    <div className="rounded-full bg-red-500 text-white w-fit px-1 py-1">
                                                        <FaXmark />
                                                    </div>
                                             }
                                            
                                        </td>
                                        <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap flex gap-4">
                                            <button className="bg-blue-400 rounded-md text-white font-extrabold px-4 py-2">
                                                &#8593;
                                            </button>
                                            <button className="bg-blue-400 disabled:bg-blue-300 rounded-md text-white font-extrabold px-4 py-2" disabled>
                                                &#8595;
                                            </button>
                                        </td>
                                        {/* <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap">
                                            <button className="bg-red-500 text-white rounded-md px-4 py-2 font-semibold">
                                                Disqualify
                                            </button>
                                        </td> */}
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            {/* TABLE CONTROLS */}
            <TableControls togglePopover={togglePopover} candidates={Candidates} />
            <GenericModal
                popoverId="transaction-modal"
                style=""
            >
                <AddNominee />
            </GenericModal>

        </div>
    )
}