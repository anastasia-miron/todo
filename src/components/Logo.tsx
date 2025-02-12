import React, { SVGProps } from "react";

const Logo: React.FC<SVGProps<SVGSVGElement>> = (props) => {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 140" {...props}>

            <g transform="translate(-30, -20)">
                <path d="M150 70
                     A 20 20 0 0 1 190 70
                     A 20 20 0 0 1 230 70
                     Q 230 100 190 130
                     Q 150 100 150 70"
                    fill="#4a90e2" />

                <path d="M170 70
                     A 20 20 0 0 1 210 70
                     A 20 20 0 0 1 250 70
                     Q 250 100 210 130
                     Q 170 100 170 70"
                    fill="#e74c3c" />
            </g>

            <text x="340" y="85"
                fontFamily="Open Sans, sans-serif"
                fontSize="48"
                textAnchor="middle"
                fill="var(--pico-color)"
                fontWeight="bold">Help Me</text>
        </svg>)
};

export default Logo;