export function generateStaticParams() {
    return [{ id: 'preview' }];
}

export default function TripLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
