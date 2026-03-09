import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod/v4";
import {
  registerResources,
  resourceList,
  RESOURCES_DIR,
} from "./utils/register-resources.js";
import { encode } from "plantuml-encoder";
import { join } from "path";
import { readFileSync } from "fs";

const server = new McpServer({
  name: "plantuml",
  version: "1.0.0",
});

registerResources(server);

server.registerTool(
  "read_docs",
  {
    description: `ALWAYS call this tool first before calling create_diagram.
      Returns the PlantUML documentation for the given diagram type.
      This ensures correct syntax is used when generating diagrams.`,
    inputSchema: z.object({
      type: z
        .string()
        .describe(
          `The diagram type to fetch docs for. Must be one of the available resource URIs: ${resourceList.join(", ")}`,
        ),
    }),
  },
  async ({ type }) => {
    const uri = resourceList.find((u) => u.includes(type));

    if (!uri) {
      return {
        content: [
          {
            type: "text",
            text: `No documentation found for type "${type}". Available resources:\n${resourceList.join("\n")}`,
          },
        ],
      };
    }

    const name = uri.split("/").pop()!;
    const text = readFileSync(join(RESOURCES_DIR, `${name}.md`), "utf-8");

    console.error(`[MCP] read_docs called for: ${uri}`);

    return {
      content: [
        {
          type: "text",
          text: `${text}

---

## Generation Rules

Always follow these rules when generating PlantUML markup:

1. **UML principles** — follow standard UML conventions for the diagram type (correct arrow types, relationship semantics, notation).
2. **No title** — do NOT add a title directive (e.g. title My Diagram) at the top of the diagram.
3. **No colors** — do NOT use any color directives (e.g. #Red, #back, skinparam backgroundColor, etc.) unless the user explicitly requests colors.
4. **Minimal skinparam** — avoid decorative skinparam overrides. Only use skinparam when necessary for layout or readability, never for aesthetics.
5. **Clean and readable** — keep the markup concise and well-structured. Avoid redundant labels, excessive notes, or unnecessary elements.`,
        },
      ],
    };
  },
);

server.registerTool(
  "create_diagram",
  {
    description: `Generates a PlantUML diagram URL from valid PlantUML markup.
      YOU MUST call read_docs first to get the correct syntax for the diagram type.
      Do NOT guess PlantUML syntax — always read the docs first.
      
      The generated PlantUML MUST follow these rules:
      - Follow standard UML principles and conventions for the diagram type
      - Do NOT include a title directive
      - Do NOT use colors or custom skinparam styling unless the user explicitly asked for colors
      - Keep the markup clean, minimal and readable`,
    inputSchema: z.object({
      plantuml: z.string().describe("Valid PlantUML markup to render"),
      type: z
        .enum([
          "sequence",
          "use case",
          "class",
          "activity",
          "component",
          "state",
          "object",
          "deployment",
          "timing",
          "regex",
          "network",
          "wireframe",
          "archimate",
          "gantt",
          "mindmap",
          "work breakdown structure (WBS)",
          "Extended Backus–Naur Form (EBNF)",
        ])
        .describe("The type of UML diagram to generate"),
    }),
  },
  async ({ plantuml }) => {
    const encoded = encode(plantuml);
    return {
      content: [
        {
          type: "text",
          text: `https://www.plantuml.com/plantuml/png/${encoded}`,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("PlantUML MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
