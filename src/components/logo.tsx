import React, { useState } from 'react';
import { ClassNameValue, twMerge } from 'tailwind-merge';
import Link from 'next/link';

interface LogoProps {
    className?: ClassNameValue;
}

export const Logo = ({ className }: LogoProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link href="/" passHref>
            <div
                className={twMerge('cursor-pointer font-mono text-4xl font-bold', className)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <span>n̈</span>
                <span>o</span>
                <span
                    className={`inline-block transition-all duration-700 ${
                        isHovered ? 'animate-[smoothBounce_1.5s_ease-in-out_infinite]' : ''
                    }`}
                >
                    t
                </span>
                <span>i</span>
                <span>c</span>
                <span>3</span>
                <span className="text-blue-600">.</span>
                <style jsx>{`
                    @keyframes smoothBounce {
                        0%,
                        100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-0.5em);
                        }
                    }
                `}</style>
            </div>
        </Link>
    );
};

export default Logo;
