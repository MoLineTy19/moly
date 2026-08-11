"use client"

import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TagRow from "@/app/categories/components/tagRow";
import React, {MouseEventHandler, useCallback, useMemo, useState} from "react";
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
import {addTag, deleteTag, editTag, reorderTags, useTagStore} from "@/store/tagStore";
import {generateTagColor} from "@/utils/color";

/**
 * Страница с тегами
 */
export default function Categories() {
    const tags = useTagStore((state) => state.tags);

    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [color, setColor] = useState<string>('');
    const [icon, setIcon] = useState<number | undefined>(undefined);
    const [title, setTitle] = useState<string>('');

    const colors = DEFAULT_TAG_COLORS;
    const icons = DEFAULT_TAG_ICON;

    const openCreate = () => {
        setEditingTag(null);
        setIsCreating(true);
        setTitle('');
        setIcon(undefined);
        setColor('');
    };

    const closePanel = () => {
        setEditingTag(null);
        setIsCreating(false);
    };

    const handleEdit = useCallback((tag: Tag) => {
        setIsCreating(false);
        setEditingTag(tag);
        setTitle(tag.title);
        setIcon(tag.iconId);
        setColor(tag.color);
    }, []);

    const handleDelete = async (tag: Tag) => {
        if (!confirm(`Удалить тег «${tag.title}»? Пароли с этим тегом останутся, но станут без тега.`)) return;
        try {
            await deleteTag(tag.id);
            toast.success('Тег удалён');
            if (editingTag?.id === tag.id) closePanel();
        } catch {
            toast.error('Не удалось удалить тег');
        }
    };

    const handleClickColor = (event: React.MouseEvent, value: string) => setColor(value);
    const handleClickIcon = (event: React.MouseEvent, value: number) => setIcon(value);
    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);

    const handleClickConfirm: MouseEventHandler = async () => {
        if (!color) return toast.error("Выбери цвет!");
        if (icon === undefined) return toast.error("Выбери иконку!");
        if (!title.trim()) return toast.error("Укажи название!");

        const baseColor = generateTagColor(color);
        const payload = {
            title: title.trim(),
            iconId: icon,
            color: baseColor.color,
            backgroundColor: baseColor.backgroundColor,
            borderColor: baseColor.borderColor,
        };

        try {
            if (isCreating) {
                await addTag(payload);
                toast.success('Тег создан!');
                closePanel();
            } else if (editingTag) {
                await editTag({...editingTag, ...payload});
                toast.success('Тег обновлён!');
                closePanel();
            }
        } catch (err) {
            toast.error((err as Error).message || 'Не удалось сохранить тег');
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates}),
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event;
        if (active.id !== over?.id) {
            const oldIndex = tags.findIndex((t) => t.id === active.id);
            const newIndex = tags.findIndex((t) => t.id === over?.id);
            const newOrder = arrayMove(tags, oldIndex, newIndex);
            await reorderTags(newOrder);
        }
    };

    const tagRows = useMemo(() =>
            tags.map((tag) => (
                <TagRow key={tag.id} {...tag} onEdit={handleEdit} onDelete={handleDelete}/>
            )),
        [tags, handleEdit, handleDelete],
    );

    const panelOpen = isCreating || editingTag !== null;

    return (
        <div className="grow overflow-y-auto p-8 relative">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold text-(--text-color) flex items-center gap-3 mb-2">
                        Управление тегами
                        <span className="text-sm font-normal bg-(--background-secondary) text-(--text-muted) py-0.5 px-2.5 rounded-md border border-(--border-input-color)">
                            {tags.length}
                        </span>
                    </h1>
                    <p className="text-sm text-(--text-muted)">
                        Создавайте, редактируйте и сортируйте теги для организации ваших паролей.
                    </p>
                </div>
                <button onClick={openCreate}
                        className="bg-(--accent-color)/90 hover:bg-(--accent-color) text-(--text-color) font-medium py-2 px-4 rounded-lg shadow-lg shadow-(--accent-color)/20 transition-all flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus}/>
                    Создать тег
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 max-w-6xl">
                <div className={`grow ${panelOpen ? 'lg:w-2/3' : 'w-full'}`}>
                    <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl overflow-hidden shadow-soft">
                        <div className="px-6 py-4 border-b border-(--border-color) flex justify-between items-center">
                            <h2 className="text-sm font-medium text-(--text-muted) uppercase tracking-wider">
                                Структура тегов
                            </h2>
                            <span className="text-xs text-(--text-muted)">
                                Drag &amp; Drop для сортировки
                            </span>
                        </div>
                        <div className="p-4 space-y-2">
                            {tags.length === 0 ? (
                                <div className="p-8 text-center text-sm text-(--text-muted)">
                                    Пока нет ни одного тега. Нажмите «Создать тег».
                                </div>
                            ) : (
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                                    <SortableContext items={tags.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                        {tagRows}
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    </div>
                </div>

                {panelOpen && (
                    <div className="lg:w-1/3">
                        <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl shadow-soft sticky top-0">
                            <div className="px-6 py-4 border-b border-(--border-color) flex justify-between items-center">
                                <h2 className="text-sm font-medium text-(--text-color)">
                                    {isCreating ? 'Новый тег' : 'Редактирование тега'}
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-xs font-medium text-(--text-muted) mb-2">
                                        Название
                                    </label>
                                    <input type="text" value={title} onChange={handleChangeTitle}
                                           className="w-full px-4 py-2 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) focus:ring-1 focus:ring-(--accent-color) transition-all"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-(--text-muted) mb-3">Цвет</label>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((value, index) => (
                                            <ColorCircle key={index} color={value} isSelected={color === value}
                                                         onClick={(event) => handleClickColor(event, value)}/>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-(--text-muted) mb-3">
                                        Иконка
                                    </label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {icons.map((value, index) => (
                                            <IconOption key={index} icon={value} isSelected={icon === index}
                                                        onClick={(event) => handleClickIcon(event, index)}/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-(--border-color) bg-(--background-secondary)/50 rounded-b-xl flex justify-end gap-3">
                                <button className="px-4 py-2 rounded-lg text-sm font-medium text-(--text-muted) hover:text-(--text-color) transition-colors" onClick={closePanel}>
                                    Отмена
                                </button>
                                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-(--accent-color)/90 hover:bg-(--accent-color) text-(--text-color) shadow-md shadow-(--accent-color)/10 transition-colors" onClick={handleClickConfirm}>
                                    {isCreating ? 'Создать' : 'Сохранить'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}