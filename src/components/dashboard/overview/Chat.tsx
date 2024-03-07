import React, { useState, useEffect } from 'react';
import { Card, TextField, Button, Typography, List, ListItem, CircularProgress, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import '../../../App.css'
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

type FunctionNameMappingType = {
    [key: string]: string;
};

const functionNameMapping: FunctionNameMappingType = {
    'discover_batching_strategies': 'Discovering batching strategies',
    'discover_prioritization_strategies': 'Discovering prioritization strategies',
    'get_redesign_pattern_info': 'Discovering redesign patterns',
    'discover_case_attributes': 'Discovering case attributes',
    'query_database': 'Retrieving Kronos report'
};

interface ChatProps {
    jobid: string;
}

const BASE_URL = 'http://193.40.11.233/db-api';

function renderMarkdown(text: string) {
    // Replace markdown headings with HTML headings
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Replace bold and italic text
    text = text.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    text = text.replace(/\*(.*)\*/gim, '<em>$1</em>');

    // Replace links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

    // Replace all line breaks with <br />
    text = text.replace(/\n/g, '<br />');

    return { __html: text };
}


export default function Chat({ jobid }: ChatProps) {
    const [message, setMessage] = useState<string>('');
    const defaultInstructions = "Use '{table_name}' as a placeholder for the actual table name in your query. If the response time is given in seconds, convert it to a convenient readable data format (years, months, days, hours, minutes). If the question relates to identifying/analyzing waiting time in transitions (e.g., where is the highest waiting time? what is the largest bottleneck?), the response must include: 1. where the waiting time is located (e.g., in which transition), 2. the waiting time duration, 3. the causes of waiting time and the duration of the causes of waiting time (how much waiting time is induced by each waiting time cause in this transition and percent from the transition's duration identified in the previous step). When presenting the results, order the causes of waiting time from the highest and highlight the main cause or causes of waiting time, 4. destination resources that contribute the most to the waiting time in this transition, and how much. Use the entire dataset when calculating these values. When presenting the results of the analysis, do not include the results in seconds. When presenting the results of the analysis, use a convenient readable data format: e.g., years, months, days, hours, minutes (use the most suitable according to the values you get). Present the results for all 4 instruction points in the response. If the question relates to recommending/suggesting redesigns (redesign options, process changes), the response must include: 1. where the redesign should be applied (e.g., to which transitions, activities, or resources), 2. what redesign to implement: - the name of the redesign, - definition, i.e., explanation of the redesign principle or redesign pattern, - application, i.e., explanation of how the redesign should be applied, - benefits, i.e., what benefits can be achieved with the redesign and why specifically this redesign is relevant and useful, - impact, i.e., how much impact it is potentially going to provide (e.g., how much the cycle time will improve). Redesign options must focus on addressing the identified causes of waiting time. Suggest at least 2 redesign options for each waiting time cause. Order the redesign options starting from the highest cause of waiting time. Use the Redesign Pattern Info function and combine it with all other knowledge you have. Make the suggestions specific in detail to address the identified waiting time.";
    const [instructions, setInstructions] = useState<string>(defaultInstructions);
    const [threadId, setThreadId] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [polling, setPolling] = useState<number | null>(null);
    const [runId, setRunId] = useState<string | null>(null);
    const [assistantInstructions, setAssistantInstructions] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('gpt-4-1106-preview');
    const [isPollingInProgress, setIsPollingInProgress] = useState<boolean>(false);
    const [caseAttributesDescription, setCaseAttributesDescription] = useState('Discovers and returns case attributes present in the event log. If returned data is empty, then there is no case attributes present in the event log.');
    const [batchingDescription, setBatchingDescription] = useState('Returns batching strategies of an event log. The function internally processes a pre-loaded event log and discovers batching strategies, providing insights into batch processing instances within a process. It characterizes each batch with details about the activity, involved resources, batch processing type (sequential, concurrent, or parallel), frequency, batch size distribution, duration distribution, and firing rules for batch initiation.');
    const [prioritizationDescription, setPrioritizationDescription] = useState('Discovers and returns prioritization strategies from an event log. This function analyzes the pre-loaded event log to identify case priority levels and classify process cases into corresponding levels. It provides insights into how cases are prioritized, ensuring that high-priority activities are executed before.');
    const [redesignPatternInfoDescription, setRedesignPatternInfoDescription] = useState('Provides detailed information about specific redesign patterns. The information includes definitions, explanations, examples, positive impacts, negative impacts, and references. The function accepts one or several pattern names and returns comprehensive details about each. Possible patterns: Contact reduction, First-contact problem resolution, Follow-up, Customer integration, Customer scheduling, Arrival time incentives, Task elimination, Fragment elimination, Task composition (combination), Task decomposition, Process decomposition, Process standardization, Process generalization, Process centralization, Case-based work, Case buffering, Periodic action, Resequencing, Parallelism, Order types (Case types), Triage, Exception, Extra resources, Resource scheduling, Assign cases, Customer teams, Fixed assignment , Flexible assignment, Case reassignement, Split responsibilities, Specialist, Empower, Department-based assignment, Experience-based task assignment, Expertise-based task assignment, Performance-based task assignment, Role-based task assignment, Teamwork-based assignment, Workload-based task assignment, Task delegation, Inventory buffering, Data elimination, Data composition, Data standardization, Capture data at source, Buffer information, Task automation, Automate for environmental impact, Fragment automation, Process automation, Integral technology , Establish standardized interfaces, Batch strategy optimization, Prioritization strategy optimization, Resource schedule optimization.');
    const [isDiscoverBatchingStrategiesEnabled, setIsDiscoverBatchingStrategiesEnabled] = useState(true);
    const [isDiscoverPrioritizationStrategiesEnabled, setIsDiscoverPrioritizationStrategiesEnabled] = useState(true);
    const [isGetRedesignPatternInfoEnabled, setIsGetRedesignPatternInfoEnabled] = useState(true);
    const [isDiscoverCaseAttributesEnabled, setIsDiscoverCaseAttributesEnabled] = useState(true);

    const handleSendMessage = async () => {
        if (!message) return;


        const replaceFunctionNames = (message: string) => {
            Object.keys(functionNameMapping).forEach((key) => {
                if (message.includes(key)) {
                    message = message.replace(new RegExp(key, 'g'), functionNameMapping[key]);
                }
            });
            return message;
        };

        const updateChatHistory = (sender: string, newMessage: string, isLoading: boolean = false) => {
            let formattedMessage: string;
            if (isLoading) {
                // Only update the last message if it's a loading message from the Assistant
                setChatHistory(prevHistory => {
                    let history = [...prevHistory];
                    if (history.length > 0 && history[history.length - 1].includes('<CircularProgress />')) {
                        const progressMessage = newMessage ? replaceFunctionNames(newMessage) : 'Working...';
                        history[history.length - 1] = `<strong>Assistant</strong><br/>${progressMessage}<br/><CircularProgress />`;
                    } else {
                        // Otherwise, append a new loading message from the Assistant
                        formattedMessage = `<strong>Assistant</strong><br/>${newMessage}<br/><CircularProgress />`;
                        history.push(formattedMessage);
                    }
                    return history;
                });
            } else {
                // For regular messages (user or final assistant messages), append them to the chat history
                formattedMessage = `<strong>${sender}</strong><br/>${newMessage}`;
                setChatHistory(prevHistory => [...prevHistory, formattedMessage]);
            }
        };

        updateChatHistory("You", message);
        setIsProcessing(true);
        updateChatHistory("Assistant", "", true);

        const updateLastChatHistory = (newMessage: string) => {
            setChatHistory(prevHistory => {
                let history = [...prevHistory];
                history[history.length - 1] = `<strong>Assistant</strong><br/>${newMessage}`;
                return history;
            });
        };

        const endpoint = threadId ? `${BASE_URL}/process` : `${BASE_URL}/start`;

        const functionStatus = {
            'discover_batching_strategies': isDiscoverBatchingStrategiesEnabled,
            'discover_prioritization_strategies': isDiscoverPrioritizationStrategiesEnabled,
            'get_redesign_pattern_info': isGetRedesignPatternInfoEnabled,
            'discover_case_attributes': isDiscoverCaseAttributesEnabled
        };

        const functionDescriptions = {
            'discover_batching_strategies': batchingDescription,
            'discover_prioritization_strategies': prioritizationDescription,
            'get_redesign_pattern_info': redesignPatternInfoDescription,
            'discover_case_attributes': caseAttributesDescription
        };
        
        try {
            const processResponse = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobid: jobid,
                    message: message,
                    threadId: threadId,
                    instructions: instructions,
                    model: selectedModel,
                    assistantInstructions: assistantInstructions,
                    functionDescriptions: functionDescriptions,
                    functionStatus: functionStatus,
                }),
            });
            const processData = await processResponse.json();

            if (!threadId) {
                setThreadId(processData.thread_id);
            }
            setRunId(processData.run_id); // Save the runId

            // Start polling for the chat status
            const poll = window.setInterval(async () => {
                // Ensure both threadId and runId are available for status check
                if (processData.thread_id && processData.run_id && !isPollingInProgress) {
                    setIsPollingInProgress(true);

                    try {
                        const statusResponse = await fetch(`${BASE_URL}/status/${jobid}/${processData.thread_id}/${processData.run_id}`);
                        const statusData = await statusResponse.json();

                        if (statusData.status === 'completed') {
                            updateLastChatHistory(statusData.message);
                            setIsProcessing(false);
                            clearInterval(poll);
                        } else if (statusData.status === 'error') {
                            updateLastChatHistory('There has been an error processing the request.' + statusData.message);
                            setIsProcessing(false);
                            clearInterval(poll);
                        } else if (statusData.status === 'failed') {
                            updateLastChatHistory('Run has failed, problem on side of openai');
                            setIsProcessing(false);
                            clearInterval(poll);
                        } else {
                            const displayMessage = statusData.message ? statusData.message : 'Working...';
                            updateChatHistory("Assistant", displayMessage, true)
                        }
                    } catch (error) {
                        console.error('Error during polling:', error);
                    } finally {
                        setIsPollingInProgress(false);
                    }
                }
            }, 5000);

            setPolling(poll);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setMessage('');
    };

    useEffect(() => {
        // Cleanup the polling interval when the component unmounts
        return () => {
            if (polling) clearInterval(polling);
        };
    }, [polling]);

    return (
        <Card style={{ padding: '1rem', margin: 'auto' }}>
            <Select
                style={{ display: 'none' }}
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                fullWidth
            >
                <MenuItem value="gpt-4-1106-preview">GPT-4-1106-Preview</MenuItem>
                <MenuItem value="gpt-4">GPT-4</MenuItem>
            </Select>
            <TextField
                style={{ display: 'none' }}
                variant="outlined"
                value={assistantInstructions}
                onChange={(e) => setAssistantInstructions(e.target.value)}
                multiline
                rows={10}
                fullWidth
                disabled={!!threadId}
                placeholder="Type assistant-level instructions"
            />
            <TextField
                style={{ display: 'none' }}
                variant="outlined"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                multiline
                rows={10}
                fullWidth
                placeholder="Type instructions"
                disabled={!!threadId}
                // style={{ marginBottom: '1rem' }}
            />
            {/* Function Descriptions */}
            <TextField
                style={{ display: 'none' }}
                label="Batching Strategies Description"
                variant="outlined"
                value={batchingDescription}
                onChange={(e) => setBatchingDescription(e.target.value)}
                fullWidth
                multiline
                disabled={!!threadId}
                rows={2}
                // style={{ marginBottom: '1rem' }}
            />
            <TextField
                style={{ display: 'none' }}
                label="Prioritization Strategies Description"
                variant="outlined"
                value={prioritizationDescription}
                onChange={(e) => setPrioritizationDescription(e.target.value)}
                fullWidth
                multiline
                disabled={!!threadId}
                rows={2}
                // style={{ marginBottom: '1rem' }}
            />
            <TextField
                style={{ display: 'none' }}
                label="Redesign Pattern Info Description"
                variant="outlined"
                value={redesignPatternInfoDescription}
                onChange={(e) => setRedesignPatternInfoDescription(e.target.value)}
                fullWidth
                multiline
                disabled={!!threadId}
                rows={2}
                // style={{ marginBottom: '1rem' }}
            />
            <TextField
                style={{ display: 'none' }}
                label="Case Attributes Discovery Description"
                variant="outlined"
                value={caseAttributesDescription}
                onChange={(e) => setCaseAttributesDescription(e.target.value)}
                fullWidth
                multiline
                disabled={!!threadId}
                rows={2}
                // style={{ marginBottom: '1rem' }}
            />

            {/* Enable/Disable Switches */}
            <FormControlLabel
                style={{ display: 'none' }}
                control={
                    <Switch
                        checked={isDiscoverBatchingStrategiesEnabled}
                        onChange={() => setIsDiscoverBatchingStrategiesEnabled(!isDiscoverBatchingStrategiesEnabled)}
                        disabled={!!threadId}
                    />
                }
                label="Enable Batching Strategies"
            />
            <FormControlLabel
                style={{ display: 'none' }}
                control={
                    <Switch
                        checked={isDiscoverPrioritizationStrategiesEnabled}
                        onChange={() => setIsDiscoverPrioritizationStrategiesEnabled(!isDiscoverPrioritizationStrategiesEnabled)}
                        disabled={!!threadId}
                    />
                }
                label="Enable Prioritization Strategies"
            />
            <FormControlLabel
                style={{ display: 'none' }}
                control={
                    <Switch
                        checked={isGetRedesignPatternInfoEnabled}
                        onChange={() => setIsGetRedesignPatternInfoEnabled(!isGetRedesignPatternInfoEnabled)}
                        disabled={!!threadId}
                    />
                }
                label="Enable Redesign Pattern Info"
            />
            <FormControlLabel
                style={{ display: 'none' }}
                control={
                    <Switch
                        checked={isDiscoverCaseAttributesEnabled}
                        onChange={() => setIsDiscoverCaseAttributesEnabled(!isDiscoverCaseAttributesEnabled)}
                        disabled={!!threadId}
                    />
                }
                label="Enable Case Attributes Discovery"
            />

            <Typography variant="h6">Chat</Typography>
            <List>
                {chatHistory.map((msg, index) => (
                    <ListItem key={index}>
                        <div dangerouslySetInnerHTML={renderMarkdown(msg.replace("<CircularProgress />", "<div class='circular-progress'></div>"))} />
                    </ListItem>
                ))}
            </List>
            <div style={{ display: 'flex', marginTop: '1rem' }}>
                <TextField
                    variant="outlined"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isProcessing) {
                            handleSendMessage();
                        }
                    }}
                    fullWidth
                    placeholder="Type a message"
                    disabled={isProcessing}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    style={{ marginLeft: '1rem' }}
                    disabled={isProcessing}
                >
                    Send
                </Button>
            </div>
        </Card>
    );
}
