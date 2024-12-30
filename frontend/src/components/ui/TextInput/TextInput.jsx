import React, { useState } from 'react';
import { Input as AntdInput } from 'antd';
import Icon from '../Icon/Icon';
import { runes } from 'runes2';
import PropTypes from 'prop-types';
import './TextInput.css';
const { TextArea, Password, OTP } = AntdInput;

// SearchInput Component
const SearchInput = ({ status, size, placeholder, disabled, prefix, suffix, onSearch, ...props }) => {
    const [loading, setLoading] = useState(false);
    
    const toggleSearch = (e) => {
        setLoading(true);
        onSearch(e);
    };

    return (
        <AntdInput
            allowClear
            size={size}
            placeholder={placeholder}
            prefix={<Icon name={prefix} size={size} />}
            suffix={<Icon name={suffix} size={size} />}
            loading={loading}
            onSearch={(e) => toggleSearch(e)}
            disabled={disabled}
            status={status}
            {...props}
        />
    );
};

SearchInput.propTypes = {
    status: PropTypes.oneOf(['error', 'warning', 'success', '']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
};

// TextAreaInput Component
const TextAreaInput = ({ status, size, defaultvalue, disabled, minRows, placeholder, ...props }) => {
    const [value, setValue] = useState(defaultvalue);

    return (
        <TextArea
        value={value}
        size={size}
        allowClear
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoSize={{ minRows: minRows || 3 }}
        status={status}
        {...props}
        />
    );
};

TextAreaInput.propTypes = {
    status: PropTypes.oneOf(['error', 'warning', 'success', '']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    defaultvalue: PropTypes.string,
    disabled: PropTypes.bool,
    minRows: PropTypes.number,
    placeholder: PropTypes.string,
};

// PasswordInput Component
const PasswordInput = ({ status, size, placeholder, disabled, ...props }) => {
    return (
        <Password
        size={size}
        allowClear
        status={status}
        placeholder={placeholder}
        disabled={disabled}
        iconRender={(visible) =>
            visible ? <Icon name="fa-sharp-duotone fa-light fa-eye" /> : <Icon name="fa-sharp fa-light fa-eye-slash" />
        }
        {...props}
        />
    );
};

PasswordInput.propTypes = {
    status: PropTypes.oneOf(['error', 'warning', 'success', '']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
};

// OTPInput Component
const OTPInput = ({ status, size, placeholder, length, mask, disabled, ...props }) => {
    return (
        <OTP
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        formatter={(str) => str.toUpperCase()}
        length={length || 5}
        mask={mask && '🔒'}
        status={status}
        iconRender={(visible) =>
            visible ? <Icon name="fa-sharp-duotone fa-light fa-eye" /> : <Icon name="fa-sharp fa-light fa-eye-slash" />
        }
        {...props}
        />
    );
};

OTPInput.propTypes = {
    status: PropTypes.oneOf(['error', 'warning', 'success', '']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    placeholder: PropTypes.string,
    length: PropTypes.number,
    mask: PropTypes.bool,
    disabled: PropTypes.bool,
};

// CounterInput Component
const CounterInput = ({ status, size, max, defaultValue, emojicount, exceedMax, placeholder, disabled, prefix, suffix, onSearch, ...props }) => {
    const [value, setValue] = useState(defaultValue || ''); // Set defaultValue or empty string if not provided
    
    // Handle the counting strategy
    const countStrategy = emojicount
        ? (txt) => runes(txt).length // Use runes for counting if emojis are involved
        : undefined;

    // Handle max length and exceed behavior
    const exceedFormatter = exceedMax
        ? (txt, { max }) => runes(txt).slice(0, max).join('') // Truncate string if it exceeds the max
        : undefined;

    return (
        <AntdInput
        allowClear
        size={size}
        maxLength={max || 10} // Default to 10 if max is not provided
        value={value} // Use controlled input value
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        prefix={<Icon name={prefix} size={size} />}
        suffix={<Icon name={suffix} size={size} />}
        onSearch={onSearch}
        {...props}
        // Handle the character counting logic for emoji count
        count={{
            show: true,
            max: max || 10,
            strategy: countStrategy,
            exceedFormatter: exceedFormatter,
        }}
        status={status}
        />
    );
};

CounterInput.propTypes = {
    status: PropTypes.oneOf(['error', 'warning', 'success', '']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    max: PropTypes.number,
    defaultValue: PropTypes.string,
    emojicount: PropTypes.bool,
    exceedMax: PropTypes.bool,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    onSearch: PropTypes.func,
};

// Input Component
const Input = ({ size, status, placeholder, disabled, defaultValue, prefix, suffix, onSearch, ...props }) => {
    const [value, setValue] = useState(defaultValue);

    return (
        <AntdInput
        status={status}
        allowClear
        size={size}
        disabled={disabled}
        defaultValue={value}
        placeholder={placeholder}
        prefix={<Icon name={prefix} size={size} />}
        suffix={<Icon name={suffix} size={size} />}
        onSearch={onSearch}
        onChange={(e) => setValue(e.target.value)}
        {...props}
        />
    );
};

Input.propTypes = {
    status: PropTypes.oneOf(['error', 'warning', 'success', '']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.string,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    onSearch: PropTypes.func,
};

export { Input, SearchInput, TextAreaInput, PasswordInput, OTPInput, CounterInput };
