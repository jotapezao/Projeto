import React from 'react';
import { Scissors } from 'lucide-react';

const BrandedIcon = ({ size = 24, settings = {}, style = {}, className = "", fallbackIcon: FallbackIcon = Scissors }) => {
    if (settings.system_logo) {
        return (
            <div className={`branded-icon ${className}`} style={{
                width: `${size}px`,
                height: `${size}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '25%',
                ...style
            }}>
                <img
                    src={settings.system_logo}
                    alt="Logo"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
        );
    }

    return <FallbackIcon size={size} style={style} className={className} />;
};

BrandedIcon.defaultFallback = Scissors;

export default BrandedIcon;
