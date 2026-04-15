import SectionButton from "@/components/sectionButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShieldHalved} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
    return (
        <aside className="row-span-2 bg-(--background-color) h-screen font-sans border-r border-white/15">
            <div className="p-4">
                <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-lg bg-green-500 ">
                        <FontAwesomeIcon icon={faShieldHalved} style={{color: "#ffffff", margin: "8px 6px"}}/>
                    </div>
                    <h1 className="text-2xl font-semibold text-(--logo-name-color)">Moly</h1>
                </div>
            </div>
            <div>Hot Keys</div>
            <div>
                <div className="flex flex-col p-3">
                    <div className="text-(--text-color)/40 text-xs tracking-wide font-medium mb-2">РАЗДЕЛЫ</div>
                    <SectionButton title="Все пароли"/>
                    <SectionButton title="Избранное"/>
                </div>
                <div className="flex flex-col p-3">
                    <div className="text-(--text-color)/40 text-xs tracking-wide font-medium mb-2">УПРАВЛЕНИЕ</div>
                    <SectionButton title="Управление категориями"/>
                    <SectionButton title="Поиск и фильтры"/>
                    <SectionButton title="Настройки безопасности"/>
                </div>
            </div>
        </aside>
    )
}