import React from 'react';
import Select from 'react-select';

const CityDropdown = ({ options, selectedOption, onChange, onBlur }) => {
    const handleSelectChange = (selected) => {
        onChange('city', selected.value);
        console.log(selectedOption)

    };

    return (
        <Select
            options={options}
            name='city'
            placeholder="Select City"
            value={selectedOption}
            onChange={handleSelectChange}
            onBlur={onBlur}
            isSearchable={true}
        />
    );
};

export default CityDropdown;
