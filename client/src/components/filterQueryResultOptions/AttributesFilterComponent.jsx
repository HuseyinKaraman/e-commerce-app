import { Checkbox } from "antd";

const AttributesFilterComponent = ({ attrsFilter, setAttrsFromFilter }) => {
    const onChange = (e, filter, valueForKey) => {
        setAttrsFromFilter((filters) => {
            if (!filters) {
                return [{ key: filter.key, values: [valueForKey] }];
            }

            let index = filters.findIndex((item) => item.key === filter.key);
            if (index === -1) {
                // if not found key
                return [...filters, { key: filter.key, values: [valueForKey] }];
            }

            // if clicked key inside filters and checked
            if (e.target.checked) {
                filters[index].values.push(valueForKey);
                let unique = [...new Set(filters[index].values)];
                filters[index].values = unique;
                return [...filters];
            }
            // if clicked key inside filters and unchecked
            let valuesWithoutUnChecked = filters[index].values.filter((val) => val !== valueForKey);
            filters[index].values = valuesWithoutUnChecked;
            if (valuesWithoutUnChecked.length > 0) {
                return [...filters];
            } else {
                let filtersWithoutOneKey = filters.filter((item) => item.key !== filter.key);
                return [...filtersWithoutOneKey];
            }
        });
    };

    return (
        <>
            {attrsFilter && attrsFilter.length > 0 && (
                <div className="flex flex-row sm:flex-col flex-wrap sm:flex-nowrap">
                    {attrsFilter?.map((filter, idx) => (
                        <div className="mb-2 w-full" key={idx}>
                            <div className="font-bold">{filter.key}</div>
                            <Checkbox.Group className="w-full flex md:flex-col">
                                {filter.value.map((valueForKey, idx2) => (
                                    <Checkbox
                                        value={valueForKey}
                                        id={idx2}
                                        key={idx2}
                                        className="select-none !ml-3"
                                        onChange={(e) => onChange(e, filter, valueForKey)}
                                    >
                                        <label htmlFor={idx2} className="cursor-pointer">
                                            {valueForKey}
                                        </label>
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default AttributesFilterComponent;
