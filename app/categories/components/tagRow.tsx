import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGripVertical, faPen, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {Tag} from "@/types/components";
import {useSortable} from "@dnd-kit/sortable";
import {DEFAULT_TAG_ICON} from "@/config";
import {memo} from "react";

interface TagRowProps extends Tag {
    onEdit: (tag: Tag) => void;
}

const TagRow = memo(function TagRow({ onEdit, ...tag }: TagRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: tag.id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: isDragging ? 'none' : transition,
        opacity: isDragging ? 0.5 : 1,
    };
    return (
        <div ref={setNodeRef} style={style} className="group flex items-center justify-between p-3 rounded-lg border border-gray-800/50 bg-(--background-color) hover:bg-(--background-secondary)/50 hover:border-gray-700 cursor-pointer">
            <div className="flex items-center gap-4">
                <div
                    className="drag-handle text-gray-600 hover:text-gray-400 px-1 py-2 cursor-grab active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                >
                    <FontAwesomeIcon icon={faGripVertical} />
                </div>
                <div className="w-8 h-8 rounded-lg border flex items-center justify-center"
                     style={{
                         backgroundColor: tag.backgroundColor,
                         borderColor: tag.borderColor,
                         color: tag.color,
                     }}
                >
                    <FontAwesomeIcon icon={DEFAULT_TAG_ICON[tag.iconId]}/>
                </div>
                <div>
                    <div className="text-(--text-color) font-medium text-sm">
                        {tag.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                        {tag.countUses} записи
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-md bg-(--background-color) border border-gray-800 text-gray-400 hover:text-(--text-color) hover:border-gray-600 flex items-center justify-center transition-colors" onClick={() => onEdit(tag)}>
                    <FontAwesomeIcon icon={faPen} />
                </button>
                <button className="w-8 h-8 rounded-md bg-(--background-color) border border-gray-800 text-red-400 hover:text-red-300 hover:border-red-900/50 hover:bg-red-900/20 flex items-center justify-center transition-colors" onClick={() => {}}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
            </div>
        </div>
    )
})

export default TagRow