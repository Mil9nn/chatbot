
const BlinkingDots = () => {
    return (
        <div className="absolute left-3 -top-3 text-sm text-muted-foreground italic px-4 flex items-center gap-1">
            Bot is typing
            <span className="typing-dot">.</span>
            <span className="typing-dot">.</span>
            <span className="typing-dot">.</span>
        </div>
    )
}

export default BlinkingDots
