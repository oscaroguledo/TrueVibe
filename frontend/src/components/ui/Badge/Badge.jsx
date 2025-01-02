import React, { useEffect, useState } from 'react';
import { Badge as AntdBadge } from 'antd';
import PropTypes from 'prop-types';
import './Badge.css';

const Badge = ({ children, size, count, overflowCount,dot, ...props }) => {
    return (
        <AntdBadge
            size={size}
            count={count}
            overflowCount={overflowCount}
            dot={dot}
            {...props}
        >
            {children && children}
        </AntdBadge>
    );
};

Badge.propTypes = {
    children: PropTypes.node,
    size: PropTypes.string,
    count: PropTypes.number,
    dot :PropTypes.bool,
    overflowCount: PropTypes.number,
};

Badge.default = {
    size: 'default',
    count: 1,
    overflowCount: 99,
};
const SuffixBadge = ({ size, count, overflowCount, ...props }) => {
    const [value, setValue] = useState(count);
    const [exceed, setExceed] = useState(false);
    // Update value whenever `count` changes or when component mounts
    useEffect(() => {
        if (count > overflowCount) {
            setValue(`${overflowCount}+`);
            setExceed(true);
        } else {
            setValue(count);
            setExceed(false)
        }
    }, [count, overflowCount]); // Dependencies: Re-run the effect when count or overflowCount changes

    return (
        <small className={`suffix-badge suffix-badge-${size} ${exceed?'suffix-badge-exceed':'suffix-badge-not-exceed'}`} {...props}>{value}</small>
    );
};

SuffixBadge.propTypes = {
    children: PropTypes.node,
    size: PropTypes.oneOf(['small','default','large']),
    count: PropTypes.number,
    overflowCount: PropTypes.number,
};

SuffixBadge.default = {
    size: 'default',
    count: 0,
    overflowCount: 99,
};

export {AntdBadge,Badge,SuffixBadge};
