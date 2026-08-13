import Link from "next/link";

/**
 * Страница 404
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4 p-8 text-center bg-(--background-color)">
            <h1 className="text-2xl font-semibold text-(--text-color)">
                Страница не найдена
            </h1>
            <p className="text-sm text-(--text-muted) max-w-sm">
                Возможно, ссылка устарела или была введена с ошибкой.
            </p>
            <Link href="/passwords"
                  className="mt-2 px-4 py-2 rounded-lg bg-(--accent-color)/90 hover:bg-(--accent-color) text-(--text-color) text-sm font-medium transition-colors">
                К паролям
            </Link>
        </div>
    );
}
