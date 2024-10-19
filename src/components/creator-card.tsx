interface CreatorCardProps {
    name: string;
    description: string;
    // might just want a creator type
}

export function CreatorCard({ name, description }: CreatorCardProps) {
    return (
        <div className="rounded border p-5">
            <p className="font-bold">{name}</p>
            <p className="">{description}</p>
        </div>
    );
}
