import React, {useState, ChangeEvent, useEffect} from 'react';
import { Select, MenuItem, Typography, Paper, Grid } from '@material-ui/core';

interface ActivityData {
    activity: string;
    batch_frequency: number;
    duration_distribution: { [key: string]: number };
    firing_rules: {
        confidence: number;
        rules: Array<Array<{ attribute: string; comparison: string; value: string | number | Array<string> }>>;
        support: number;
    };
    resources: string[];
    size_distribution: { [key: string]: number };
    type: string;
}

interface ErrorObject {
    error: string;
}

type DataProp = ActivityData[] | ErrorObject;

interface BatchingComponentProps {
    data: DataProp;
    defaultActivity?: string;
}
interface Rule {
    attribute: string;
    comparison: string;
    value: string | number | Array<string>;
}

type RuleGroup = Rule[];

export default function BatchingComponent({ data, defaultActivity }: BatchingComponentProps) {
    const [selectedActivity, setSelectedActivity] = useState<string>(defaultActivity || '');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (defaultActivity) {
            setSelectedActivity(defaultActivity);
        }

        // Check if data has an error field
        if (data && 'error' in data) {
            setError(data.error);
        }
    }, [defaultActivity, data]);

    if (error) {
        // If there's an error, display it
        return <Typography color="error">{error}</Typography>;
    }

    const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
        setSelectedActivity(event.target.value as string);
    };

    const isActivityDataArray = (data: DataProp): data is ActivityData[] => {
        return Array.isArray(data);
    };

    const getActivityData = (activityName: string): ActivityData | null => {
        if (isActivityDataArray(data)) {
            return data.find(item => item.activity === activityName) || null;
        }
        return null;
    };

    const displayField = (field: any, fieldName?: string): string => {
        if (fieldName === 'batch_frequency' || fieldName === 'confidence' || fieldName === 'support') {
            return field ? `${(field * 100).toFixed(2)}%` : 'N/A';
        }
        return field ? field.toString() : 'N/A';
    };

    const selectedActivityData = getActivityData(selectedActivity);

    const renderRules = (rules: RuleGroup[]) => {
        if (!rules || rules.length === 0) return 'N/A';
        return rules.map((ruleGroup: RuleGroup, index: number) => (
            <div key={index}>
                {ruleGroup.map((rule: Rule, ruleIndex: number) => (
                    <Typography key={ruleIndex}>
                        {rule.attribute} {rule.comparison} {displayField(rule.value)}
                    </Typography>
                ))}
            </div>
        ));
    };



    return (
        <div>
            <Select
                value={selectedActivity}
                onChange={handleChange}
                displayEmpty
                fullWidth
                style={{ marginBottom: '20px' }}
            >
                <MenuItem value="">
                    <em>Select an Activity</em>
                </MenuItem>
                {isActivityDataArray(data) && data.map((item, index) => (
                    <MenuItem key={index} value={item.activity}>{item.activity}</MenuItem>
                ))}
            </Select>

            {selectedActivity && selectedActivityData && (
                <Paper style={{ padding: '20px' }}>
                    <Typography variant="h6">{displayField(selectedActivityData.activity)}</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography>Batch Frequency: {displayField(selectedActivityData.batch_frequency, 'batch_frequency')}</Typography>
                            <Typography>Type: {displayField(selectedActivityData.type)}</Typography>
                            <Typography>Resources: {selectedActivityData.resources ? selectedActivityData.resources.join(', ') : 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>Duration Distribution:</Typography>
                            {selectedActivityData.duration_distribution ? (
                                <ul>
                                    {Object.entries(selectedActivityData.duration_distribution).map(([key, value]) => (
                                        <li key={key}>{key}: {displayField(value)}</li>
                                    ))}
                                </ul>
                            ) : <Typography>N/A</Typography>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>Firing Rules Confidence: {displayField(selectedActivityData.firing_rules.confidence, 'confidence')}</Typography>
                            <Typography>Firing Rules Support: {displayField(selectedActivityData.firing_rules.support, 'support')}</Typography>
                            <Typography>Firing Rules:</Typography>
                            {renderRules(selectedActivityData.firing_rules.rules)}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>Size Distribution:</Typography>
                            {selectedActivityData.size_distribution ? (
                                <ul>
                                    {Object.entries(selectedActivityData.size_distribution).map(([key, value]) => (
                                        <li key={key}>{key}: {displayField(value)}</li>
                                    ))}
                                </ul>
                            ) : <Typography>N/A</Typography>}
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </div>
    );
}


//confidence and support under spoiler Firing Rules
//frequency to percentage