/**
 * Блок-заглушка под загружаемый контент. Пульсирует и повторяет форму
 * будущего содержимого, в отличие от текста «Загрузка…». Цвет берётся из
 * токена --surface-inactive, поэтому корректен в любой теме.
 */
export default function Skeleton({className = ''}: { className?: string }) {
    return <div className={`animate-pulse rounded-lg bg-(--surface-inactive) ${className}`}/>;
}
