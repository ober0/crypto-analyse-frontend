const KNOWN_MODEL_LABELS: Record<string, string> = {
    Gpt5: 'GPT-5',
    Deepseek4Flash: 'DeepSeek 4 Flash',
    Llama4: 'Llama 4'
}

export const formatModelLabel = (model: string) =>
    KNOWN_MODEL_LABELS[model] ?? model.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
