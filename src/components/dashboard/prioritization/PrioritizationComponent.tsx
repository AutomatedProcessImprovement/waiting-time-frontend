import React from 'react';
import { Typography, Paper } from '@material-ui/core';

interface Rule {
    attribute: string;
    comparison: string;
    value: string | number;
}

interface PriorityLevel {
    priority_level: number;
    rules: Array<Array<Rule>>;
}

interface PrioritizationComponentProps {
    data: PriorityLevel[];
}

export default function PrioritizationComponent({ data }: PrioritizationComponentProps) {
    const renderRule = (rule: Rule) => (
        <Typography key={`${rule.attribute}-${rule.comparison}-${rule.value}`}>
            {rule.attribute} {rule.comparison} {rule.value}
        </Typography>
    );

    const renderPriorityLevel = (priorityLevel: PriorityLevel) => (
        <Paper style={{ margin: '10px', padding: '10px' }} key={priorityLevel.priority_level}>
            <Typography variant="h6">Priority Level: {priorityLevel.priority_level}</Typography>
            {priorityLevel.rules.map((ruleGroup, index) => (
                <div key={index}>
                    {ruleGroup.map(rule => renderRule(rule))}
                </div>
            ))}
        </Paper>
    );

    if (!data || data.length === 0) {
        return <Typography>No prioritization strategies available.</Typography>;
    }

    return (
        <div>
            {data.map(priorityLevel => renderPriorityLevel(priorityLevel))}
        </div>
    );
}
