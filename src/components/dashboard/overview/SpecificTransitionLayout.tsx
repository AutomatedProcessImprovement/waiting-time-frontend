import React from 'react';

interface SpecificTransitionLayoutProps {
    jobId: string;
    selectedActivityPair: any;
}

const SpecificTransitionLayout: React.FC<SpecificTransitionLayoutProps> = ({ jobId, selectedActivityPair }) => {
    return selectedActivityPair;
};

export default SpecificTransitionLayout;