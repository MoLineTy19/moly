"use client"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faArrowsRotate,
    faEyeLowVision,
    faGlobe,
    faKey, faPlus, faTag,
    faWandMagicSparkles
} from "@fortawesome/free-solid-svg-icons";
import {faCopy, faEye, faUser} from "@fortawesome/free-regular-svg-icons";
import React, { MouseEventHandler, useState} from "react";
import toast from "react-hot-toast";
import AdditionOption from "@/app/passwords/addPassword/additionalOptions";
import CheckBox from "@/app/passwords/addPassword/checkBox";
import {addPassword, PasswordStructure} from "@/store/use-passwords-store";
import Generator from "@/app/passwords/addPassword/generator";
import MetaData from "@/app/passwords/addPassword/metaData";
import Tags from "@/app/passwords/addPassword/tags";



export default function AddPage() {
    const [password, setPassword] = useState("");

    const handleClickConfirmSave: MouseEventHandler = (e) => {
        e.preventDefault();

        const data: PasswordStructure = {
            name: 'Валорант',
            login: '12312312@gmail.com',
            password: password,
            category: '123',
            status: 'Надежный',
            updatedAt: '123',
        }
        addPassword(data)
        toast.success("Даннные добавлены")
    }

    return (
        <div className="grow overflow-y-auto p-8 relative flex justify-center">
            <div className="w-full max-w-3xl pb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-(--text-color) mb-2">Создать запись</h1>
                    <p className="text-(--text-muted) brightness-130 text-sm">Добавьте новые учетные данные в ваш безопасный сейф.</p>
                </div>
                <form className="space-y-6">
                    <MetaData/>
                    <Generator password={password} setPassword={setPassword}/>
                    <Tags/>
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button type="button" className="px-6 py-2.5 rounded-lg border border-(--text-muted)/20 text-(--text-color)/80 hover:text-(--text-color) hover:bg-dark-800 font-medium text-sm transition-colors">
                            Отмена
                        </button>
                        <button type="submit" className="px-8 py-2.5 rounded-lg bg-(--accent-color)/90 hover:bg-(--accent-color) text-(--text-color) font-medium text-sm shadow-lg shadow-(--accent-color)/20 transition-all cursor-pointer" onClick={handleClickConfirmSave}>
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}