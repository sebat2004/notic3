import { ClassNameValue, twMerge } from 'tailwind-merge';

interface LogoProps {
    className?: ClassNameValue;
}

export const Logo = ({ className }: LogoProps) => {
    return <p className={twMerge('font-mono text-4xl font-bold', className)}>n̈otic3</p>;
};
