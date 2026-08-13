import {Password} from "@/types";
import BoardCard from "@/app/passwords/components/boardCard";

export default function BoardView({passwords}: { passwords: Password[] }) {
    if (!passwords?.length) return null;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {passwords.map((p, i) => (
                <div key={p.id} className="stagger-in" style={{animationDelay: `${Math.min(i, 12) * 40}ms`}}>
                    <BoardCard item={p}/>
                </div>
            ))}
        </div>
    );
}