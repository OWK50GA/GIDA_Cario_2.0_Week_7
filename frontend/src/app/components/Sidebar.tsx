import React from "react"
import { CastVote, CountVotes, EndElection, NominateCandidate, RemoveVote, StarknetSvg, StartElection } from "./icons"
import { clsx } from 'clsx'
import { SideBarOptions } from "../common/data"

export const Sidebar: React.FC<{ classname?: string }> = ({ classname }) => {
    return (
        <div
            className={clsx("py-10 px-10 text-white text-l bg-[#0009ab] h-full flex flex-col gap-40")}
        >
            <div>
                <StarknetSvg />
            </div>
            
            <div className="flex flex-col justify-center gap-6 mt-10">
                {
                    SideBarOptions.map((opt, i) => {
                        const Icon = opt.icon
                        return (
                            <div
                                role="button" 
                                key={opt.id} 
                                className="flex justify-normal gap-2 items-center hover:bg-blue-400 hover:text-[#0009ab] px-4 py-2 rounded-md"
                            >
                                {Icon}
                                <span>{opt.label}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}