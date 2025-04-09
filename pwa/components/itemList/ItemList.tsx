import React from "react";
import styles from "./ItemList.module.css"; // Ensure this path is correct

interface FieldConfig {
    key: string; // Field path (e.g., "event.name")
    label: string; // Friendly display name
    valueFn?: (item: any) => string; // Optional function to compute the value
}

interface ItemListProps<T> {
    items: T[];
    fields: FieldConfig[]; // Array of field configurations
    renderItem?: (item: T) => void; // Correctly typed renderItem
    headerClassName?: string; // Optional class name for the header
    itemClassName?: string; // Optional class name for the items
}

const ItemList = <T,>({
    items,
    fields,
    renderItem = () => {}, // Default to a no-op function
    headerClassName = "", // Default to an empty string
    itemClassName = "", // Default to an empty string
}: ItemListProps<T>): JSX.Element => {
    const handleRowClick = (item: T) => {
        console.debug("Row clicked:", item);
        renderItem(item); // Safely invoke renderItem
    };

    const getValueByPath = (item: T, field: FieldConfig): string => {
        if (field.valueFn) {
            return field.valueFn(item); // Use the function if provided
        }
        const value = field.key
            .split(".")
            .reduce((acc: any, key) => acc?.[key], item);
        if (typeof value === "function") {
            return value.call(item); // Call the method if it's a function
        }
        return value || "";
    };

    return (
        <div className={styles.itemListContainer}>
            <div className={`${styles.listHeader} ${headerClassName}`}>
                {fields.map((field) => (
                    <div className={styles.listHeaderField} key={field.key}>
                        {field.label}
                    </div>
                ))}
            </div>
            {items.map((item, index) => (
                <div
                    className={`${styles.listItem} ${itemClassName}`}
                    key={index}
                    onClick={() => handleRowClick(item)}
                    style={{ cursor: "pointer" }} // Add pointer cursor for better UX
                >
                    {fields.map((field) => (
                        <div className={styles.listItemField} key={field.key}>
                            {getValueByPath(item, field)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ItemList;
