
type PageTitleProps = {
    title: string;
    otherChildren?: JSX.Element[]
}

export default function PageTitle({ title, otherChildren }: PageTitleProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">{title}</h1>
            {otherChildren?.map((child: JSX.Element, index: number) => {
                return (
                    <div key={child.key}>
                        {child}
                    </div>
                )
            })}
        </div>
    )
}