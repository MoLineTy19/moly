import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe, faKey, faShieldHalved, faTag} from "@fortawesome/free-solid-svg-icons";
import {faCalendar, faUser} from "@fortawesome/free-regular-svg-icons";
import {Password} from "@/types";
import Row from "./row";

export default function TableView({
    passwords,
    currentPage,
    itemPerPage,
    selectedIds,
    onToggleRow,
    onTogglePage,
}: {
    passwords: Array<Password>;
    currentPage: number;
    itemPerPage: number;
    selectedIds: Set<number>;
    onToggleRow: (id: number) => void;
    onTogglePage: (ids: number[], selectAll: boolean) => void;
}) {
    const pageIds = passwords
        .slice(currentPage * itemPerPage, (currentPage + 1) * itemPerPage)
        .map((p) => p.id);

    // «Выделить всё» на текущей странице: чекбокс в шапке отмечен, когда выбраны
    // все видимые строки. indeterminate показывает частичное выделение.
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
    const someSelected = !allSelected && pageIds.some((id) => selectedIds.has(id));

    return (
        <table className="w-full text-left border-collapse">
            <thead>
            <tr className="border-b border-(--border-color) text-xs font-medium text-(--text-muted) uppercase tracking-wider bg-(--background-secondary)">
                <th className="py-4 px-4 w-12 text-center">
                    <label className="relative flex items-center justify-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="opacity-0 absolute h-4 w-4 z-10"
                            checked={allSelected}
                            // indeterminate нельзя задать пропсом в React, выставляем через ref.
                            ref={(el) => {
                                if (el) el.indeterminate = someSelected;
                            }}
                            onChange={() => onTogglePage(pageIds, !allSelected)}
                        />
                        <div className={`h-4 w-4 rounded flex items-center border justify-center transition-colors
        ${allSelected ? 'bg-(--accent-color) border-(--accent-color)' : 'bg-(--background-color) border-(--border-input-color) group-hover:border-(--border-input-color)/80'}`}>
                            {allSelected && <span className="text-(--text-color) text-xs">✓</span>}
                            {someSelected && <span className="text-(--text-color) text-xs">-</span>}
                        </div>
                    </label>
                </th>
                <th className="py-4 px-4 font-medium w-lg">
                    <FontAwesomeIcon icon={faGlobe} className="mr-2"/>
                    САЙТ / НАЗВАНИЕ
                </th>
                <th className="py-4 px-4 font-medium w-1/5 border-l border-(--border-color)">
                    <FontAwesomeIcon icon={faUser} className="mr-2"/>
                    ЛОГИН
                </th>
                <th className="py-4 px-4 font-medium w-1/7 border-l border-(--border-color)">
                    <FontAwesomeIcon icon={faKey} className="mr-2"/>
                    Пароль
                </th>
                <th className="py-4 px-4 font-medium border-l border-(--border-color)">
                    <FontAwesomeIcon icon={faTag} className="mr-2"/>
                    ТЕГ
                </th>
                <th className="py-4 px-4 font-medium  w-1/8 border-l border-(--border-color)">
                    <FontAwesomeIcon icon={faShieldHalved} className="mr-2"/>
                    СТАТУС
                </th>
                <th className="py-4 px-4 font-medium  w-1/10 border-l border-(--border-color)">
                    <FontAwesomeIcon icon={faCalendar} className="mr-2"/>
                    ОБНОВЛЕНО
                </th>
            </tr>
            </thead>
            <tbody className="text-sm text-(--text-color)/80">
            {
                passwords
                    .slice(currentPage * itemPerPage, (currentPage + 1) * itemPerPage)
                    .map((item) => (
                        <Row
                            item={item}
                            key={item.id}
                            selected={selectedIds.has(item.id)}
                            onToggle={onToggleRow}
                        />
                    ))
            }
            </tbody>
        </table>
    )
}
