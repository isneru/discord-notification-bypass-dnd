import { addMessageAccessory, removeMessageAccessory } from "@api/MessageAccessories";
import { disableStyle, enableStyle } from "@api/Styles";
import definePlugin from "@utils/types";
import { React } from "@webpack/common";
import style from "./markdown-preview.css?managed";

declare module "./marked.min.js" {
    const marked: {
        parse(src: string, options?: { gfm?: boolean; breaks?: boolean }): string;
        use(options: { renderer: Record<string, (token: any) => string> }): void;
    };
    export { marked };
}
import { marked } from "./marked.min.js";

declare module "./highlight.min.js" {
    const hljs: {
        highlight(code: string, options: { language: string }): { value: string };
        getLanguage(name: string): unknown;
    };
    export default hljs;
}
import hljs from "./highlight.min.js";

marked.use({
    renderer: {
        code(token: { text: string; lang?: string }) {
            const language = token.lang && hljs.getLanguage(token.lang) ? token.lang : "plaintext";
            const highlighted = hljs.highlight(token.text, { language }).value;
            return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
        }
    }
});

const MAX_SIZE = 100 * 1024;

function MarkdownPreview({ url }: { url: string }) {
    const [html, setHtml] = React.useState<string | null>(null);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        const controller = new AbortController();
        fetch(url, { signal: controller.signal })
            .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
            .then(text => setHtml(marked.parse(text, { gfm: true })))
            .catch(e => {
                if ((e as Error).name !== "AbortError") setError(true);
            });
        return () => controller.abort();
    }, [url]);

    if (error) return <div className="md-preview-error">Could not load preview.</div>;
    if (html === null) return <div className="md-preview-loading">Loading preview...</div>;
    return <div className="md-preview-container" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default definePlugin({
    name: "MarkdownPreview",
    description: "Renders .md and .mdx file attachments as inline GFM previews",
    authors: [{ name: "isneru", id: 0n }],
    dependencies: ["MessageAccessoriesAPI"],

    start() {
        enableStyle(style);
        addMessageAccessory("MarkdownPreview", props => {
            const attachments = (props.message.attachments as any[]).filter(
                a => (a.filename.endsWith(".md") || a.filename.endsWith(".mdx")) && a.size <= MAX_SIZE
            );
            if (!attachments.length) return null;
            return (
                <>
                    {attachments.map(a => (
                        <MarkdownPreview key={a.id} url={a.url} />
                    ))}
                </>
            );
        });
    },

    stop() {
        disableStyle(style);
        removeMessageAccessory("MarkdownPreview");
    },
});
