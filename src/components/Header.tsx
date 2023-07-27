import { FC } from 'react';

interface HeaderProps {
    title: string;
    subtitle: string;
}

const Header: FC<HeaderProps> = ({
    title,
    subtitle
}) => {
    return (
        <div className="flex flex-col items-start justify-start space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
                {title}
            </h2>
            <p className='text-sm font-medium text-zinc-500'>
                {subtitle}
            </p>
        </div>
    )
}

export default Header
