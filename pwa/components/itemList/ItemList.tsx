import React from "react";
import styles from "./ItemList.module.css"; // Ensure this path is correct

interface FieldConfig {
    key: string; // Field path (e.g., "event.name")
    label: string; // Friendly display name
}

interface ItemListProps<T> {
    items: T[];
    fields: FieldConfig[]; // Array of field configurations
    renderItem?: (item: T) => void; // Correctly typed renderItem
}

const ItemList = <T,>({
    items,
    fields,
    renderItem = () => {}, // Default to a no-op function
}: ItemListProps<T>): JSX.Element => {
    const handleRowClick = (item: T) => {
        console.log("Row clicked:", item);
        renderItem(item); // Safely invoke renderItem
    };

    const getValueByPath = (item: T, path: string): string => {
        return (
            path.split(".").reduce((acc: any, key) => acc?.[key], item) || ""
        );
    };

    return (
        <div className={styles.listContainer}>
            <div className={styles.listHeader}>
                {fields.map((field) => (
                    <div className={styles.listHeaderField} key={field.key}>
                        {field.label}
                    </div>
                ))}
            </div>
            {items.map((item, index) => (
                <div
                    className={styles.listItem}
                    key={index}
                    onClick={() => handleRowClick(item)}
                    style={{ cursor: "pointer" }} // Add pointer cursor for better UX
                >
                    {fields.map((field) => (
                        <div className={styles.listItemField} key={field.key}>
                            {getValueByPath(item, field.key)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ItemList;
