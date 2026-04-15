import {faShieldHalved} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function SectionButton({title}: {title: string}) {
    return (
        <button className="flex rounded-lg gap-2 items-center p-2 cursor-pointer  hover:bg-dark-800/50 transition-colors text-(--text-color)/70 hover:text-(--text-color) hover:bg-white/10 font-light">
            <FontAwesomeIcon icon={faShieldHalved} style={{color: "#00c74f", margin: "6px 4px"}}/>
            {title}
        </button>
    )
}