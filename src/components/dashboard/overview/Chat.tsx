import React, { useState, useEffect } from 'react';
import { Card, TextField, Button, Typography, List, ListItem } from '@mui/material';
import DOMPurify from 'dompurify';

interface ChatProps {
    jobid: string;
}

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

    // Replace line breaks with <br>
    text = text.replace(/\n$/gim, '<br />');

    return { __html: text };
}

export default function Chat({ jobid }: ChatProps) {
    const [message, setMessage] = useState<string>('');
    const [threadId, setThreadId] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [polling, setPolling] = useState<number | null>(null);

    const handleSendMessage = async () => {
        if (!message) return;

        const updateChatHistory = (newMessage: string) => {
            setChatHistory(prevHistory => [...prevHistory, newMessage]);
        };

        updateChatHistory(`You: ${message}`);
        setIsProcessing(true);

        const endpoint = threadId
            ? `http://154.56.63.127/db-api/process/${threadId}/${jobid}/${message}`
            : `http://154.56.63.127/db-api/start/${jobid}/${message}`;

        try {
            const processResponse = await fetch(endpoint, { method: 'POST' });
            const processData = await processResponse.json();

            if (!threadId) {
                setThreadId(processData.thread_id);
            }

            // Start polling for the chat status
            const poll = window.setInterval(async () => {
                const statusResponse = await fetch(`http://154.56.63.127/db-api/status/${processData.thread_id}`);
                const statusData = await statusResponse.json();

                if (statusData.status === 'completed') {
                    updateChatHistory(`Assistant: ${statusData.message}`);
                    setIsProcessing(false);
                    clearInterval(poll);
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
            <Typography variant="h6">Chat</Typography>
            <List>
                {chatHistory.map((msg, index) => (
                    <ListItem key={index}>
                        <div dangerouslySetInnerHTML={renderMarkdown(msg)} />
                    </ListItem>
                ))}
            </List>
            <div style={{ display: 'flex', marginTop: '1rem' }}>
                <TextField
                    variant="outlined"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
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
