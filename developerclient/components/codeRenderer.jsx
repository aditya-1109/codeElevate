


const colors = {
    tag: "text-blue-400",
    attr: "text-green-400",
    string: "text-yellow-300",
    symbol: "text-blue-400",
    text: "text-gray-200",
};

const CodeRenderer = ({ code }) => {

    const tokenizeCode = (code) => {
        const regex = /(<\/?[a-zA-Z]+)|([a-zA-Z-]+=)|(".*?")|(\/?>)|(<)/g;

        let tokens = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(code)) !== null) {
            if (match.index > lastIndex) {
                tokens.push({
                    type: "text",
                    value: code.slice(lastIndex, match.index),
                });
            }

            const value = match[0];

            let type = "text";
            if (value.startsWith("<")) type = "tag";
            else if (value.endsWith("=")) type = "attr";
            else if (value.startsWith('"')) type = "string";
            else if (value === ">" || value === "/>") type = "symbol";

            tokens.push({ type, value });
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < code.length) {
            tokens.push({ type: "text", value: code.slice(lastIndex) });
        }

        return tokens;
    };

    const tokens = tokenizeCode(code);

    return (
        <pre className="font-mono text-sm bg-[#0f172a] z-0 w-full p-4 rounded-lg">
            {tokens.map((t, i) => (
                <span key={i} className={colors[t.type]}>
                    {t.value}
                </span>
            ))}
        </pre>
    );
}

export default CodeRenderer;