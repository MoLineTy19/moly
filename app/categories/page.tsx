"use client"

import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TagRow from "@/app/categories/components/tagRow";
import React, {MouseEventHandler, useCallback, useEffect, useMemo, useState} from "react";
import ColorCircle from "@/app/categories/components/colorCircle";
import {DEFAULT_TAG_ICON, DEFAULT_TAG_COLORS} from "@/config";
import IconOption from "@/app/categories/components/IconOption";
import toast from "react-hot-toast";
import {Tag} from "@/types/components";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {editTag, reorderTags, useTagStore} from "@/store/tagStore";

/**
 * Страница с тегами
 */
export default function Categories() {
    const tags = useTagStore((state) => state.tags);
    // const fetchTags = useTagStore((state) => state.fetchTags);
    //
    // useEffect(() => {
    //     fetchTags();
    // }, [fetchTags])

    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [color, setColor] = useState<string>('');
    const [icon, setIcon] = useState<number>();
    const [title, setTitle] = useState<string>('');

    const colors = DEFAULT_TAG_COLORS;
    const icons = DEFAULT_TAG_ICON;

    const handleEdit = useCallback((tag: Tag) => {
        if (editingTag) {
            return setEditingTag(null);
        }

        setEditingTag(tag)
        setTitle(tag.title)
        setIcon(tag.iconId)
        setColor(tag.color)
    }, [editingTag])

    const handleClickColor = (event: React.MouseEvent, value: string) => {
        setColor(value);
    }

    const handleClickIcon = (event: React.MouseEvent, value: number) => {
        setIcon(value);
    }

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    const handleClickConfirm: MouseEventHandler = () => {
        if (!editingTag) return

        if (!color) return toast.error("Выбери цвет!");
        if (!icon) return toast.error("Выбери иконку!");
        if (!title) return toast.error("Укажи название!");

        editTag(editingTag)
        setEditingTag(null)
        setColor('')
        setIcon(undefined)
        setTitle('')
        toast.success('Тег обновлен!')
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id ) {
            const oldIndex = tags.findIndex((t) => t.id === active.id);
            const newIndex = tags.findIndex((t) => t.id === over?.id);
            const newOrder = arrayMove(tags, oldIndex, newIndex);
            await reorderTags(newOrder)
        }
    }

    const tagRows = useMemo(() =>
            tags.map((tag) => (
                <TagRow key={tag.id} {...tag} onEdit={handleEdit} />
            )),
        [tags, handleEdit]
    );

    return (
        <div className="grow overflow-y-auto p-8 relative">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-(--text-color) flex items-center gap-3 mb-2">
                        Управление категориями
                        <span className="text-sm font-normal bg-(--background-secondary) text-gray-400 py-0.5 px-2.5 rounded-md border border-gray-700">
                            {tags.length}
                        </span>
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Создавайте, редактируйте и сортируйте категории для организации ваших паролей.
                    </p>
                </div>
                <button className="bg-(--accent-color)/80 hover:bg-(--accent-color) text-(--text-color) font-medium py-2 px-4 rounded-lg shadow-lg shadow-(--accent-color)/20 transition-all flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} />
                    Создать категорию
                </button>
            </div>
            <div className="flex gap-6 max-w-6xl">
                <div className="grow w-2/3">
                    <div className="bg-(--background-secondary) border border-gray-800 rounded-xl overflow-hidden shadow-soft">
                        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-(--background-secondary)">
                            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                Структура категорий
                            </h2>
                            <span className="text-xs text-gray-500">
                                Drag & Drop для сортировки
                            </span>
                        </div>
                        <div className="p-4 space-y-2">
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                                <SortableContext items={tags.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                    {
                                        tagRows
                                    }
                                </SortableContext>
                            </DndContext>
                        </div>
                    </div>
                </div>
                {
                    editingTag && (
                        <div className="w-1/3">
                            <div className='bg-(--background-secondary) border border-gray-800 rounded-xl shadow-soft sticky top-0'>
                                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                                    <h2 className="text-sm font-medium text-(--text-color)">
                                        Редактирование категории
                                    </h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">
                                            Название
                                        </label>
                                        <input type="text" value={title} className="w-full px-4 py-2 bg-(--background-color) border border-gray-700 rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) focus:ring-1 focus:ring-(--accent-color) transition-all" onChange={handleChangeTitle}/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-3">Цвет</label>
                                        <div className="flex flex-wrap gap-2">
                                            {
                                                colors.map((value, index) => (
                                                        <ColorCircle
                                                            color={value.color}
                                                            isSelected={color === value.color}
                                                            onClick={(event) => handleClickColor(event, value.color)}
                                                            key={index}
                                                        />
                                                    )
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-3">
                                            Иконка
                                        </label>
                                        <div className="grid grid-cols-6 gap-2">
                                            {
                                                icons.map((value, index) => (
                                                    <IconOption icon={value} onClick={(event) => handleClickIcon(event, index)} isSelected={icon === index} key={index}/>
                                                ))}

                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-gray-800 bg-(--background-secondary)/50 rounded-b-xl flex justify-end gap-3">
                                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-(--text-color) transition-colors" onClick={() => setEditingTag(null)}>
                                        Отмена
                                    </button>
                                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-(--accent-color)/80 hover:bg-(--accent-color) text-(--text-color) shadow-md shadow-(--accent-color)/10 transition-colors" onClick={handleClickConfirm}>
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}