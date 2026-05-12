import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {STRENGTH_LEVELS} from "@/config";
import React from "react";
import {faCopy} from "@fortawesome/free-regular-svg-icons";

export default function BoardCard() {

    const statusDetails = {
        color: 'green'
    }

    const strengthScore = 3;

    return (
        <div className="relative min-h-[30vh] border border-(--border-color) rounded-lg overflow-hidden flex flex-col">
            <div className="absolute text-[500px] text-red/20 z-0 left-1/2 -translate-x-1/2 top-1/6">
                <FontAwesomeIcon icon={faGithub}/>
            </div>
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black z-5"></div>
            <div className="relative z-10 p-6 flex flex-col grow">
                <h1 className="text-center text-2xl font-extrabold">
                    GitHub
                </h1>
                <div className="text-center mt-10 text-xl">
                    alisa.merken123@gmail.com
                </div>
                <div className="items-center flex justify-between mt-15">
                    <div>
                        Личное
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-${statusDetails.color}/10 text-${statusDetails.color} border border-${statusDetails.color}/20 text-xs`}>
                        {STRENGTH_LEVELS[strengthScore]}
                    </span>
                </div>
                <div className="mt-auto flex justify-center">
                    <input value="superhard password" disabled={true} type="password"/>
                    <FontAwesomeIcon icon={faCopy}/>
                </div>
            </div>
        </div>
    )
}