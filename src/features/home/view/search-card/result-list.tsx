import type { SearchResult } from "../../controller";
import { ResultCard } from "./result-card";

interface ResultListProps {
    results: SearchResult[];
}

export function ResultList({ results }: ResultListProps) {
    return (
        <div className="space-y-4">
            {results.map((result, i) => (
                <ResultCard
                    key={`${typeof result.anilist === "number" ? result.anilist : result.anilist.id}-${result.from}`}
                    result={result}
                    index={i}
                    isBestMatch={i === 0 && result.similarity >= 0.85}
                />
            ))}
        </div>
    );
}
