import {faBell, faShieldHalved} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Topbar() {
    return (
        <div className="border-b-2  col-span-1 h-15 flex gap-2 items-center pl-4 border-white/15 pr-7">
            <h3 className="text-(--text-color)/70">Moly</h3>
            <h3 className="text-(--text-color)/70"> {'/'} </h3>
            <div className="flex items-center">
                <FontAwesomeIcon icon={faShieldHalved} style={{color: "#00c74f", margin: "6px 4px"}}/>
                <h3 className="text-(--text-color)/70"> Пароли </h3>
            </div>
            <button className="ml-auto">
                <FontAwesomeIcon icon={faBell} style={{color: "rgb(99, 230, 190)"}} />
            </button>
        </div>
    )
}