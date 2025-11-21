import { useState } from 'react';

export const useTabs = (defaultTab: string = 'roles') => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    return {
        activeTab,
        setActiveTab,
    };
};
