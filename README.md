# plantuml-mcp

An MCP (Model Context Protocol) server that generates PlantUML diagrams from natural language descriptions. Powered by built-in PlantUML syntax documentation, it produces accurate, standard-compliant diagrams without guessing syntax.

## Features

- 🧠 **Doc-aware generation** — reads official PlantUML syntax docs before generating every diagram
- 📐 **UML compliant** — follows standard UML principles and conventions
- 🎨 **Clean output** — no titles, no unnecessary colors, minimal styling by default
- 🖼️ **Inline rendering** — diagrams render directly in Claude's response
- ✏️ **Editor link** — every diagram includes a link to open and edit it in the PlantUML editor
- 📦 **Standalone** — no external dependencies at runtime, docs are bundled with the server

## Supported Diagram Types

| Type | Description |
|---|---|
| `sequence` | Process flows and system interactions |
| `use case` | Actor and system use case relationships |
| `class` | Object-oriented class structures |
| `activity` | Workflows and decision flows |
| `component` | System architecture and components |
| `state` | State machines and lifecycle diagrams |
| `object` | Runtime object snapshots |
| `deployment` | Infrastructure and deployment topology |
| `timing` | Time-based state transitions |
| `gantt` | Project timelines and schedules |
| `mindmap` | Hierarchical idea maps |
| `wbs` | Work breakdown structures |
| `archimate` | Enterprise architecture |
| `network` | Network topology diagrams |
| `wireframe` | UI wireframe mockups |
| `ebnf` | Grammar and syntax definitions |
| `regex` | Regular expression diagrams |

## Installation

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/Beyond-Web-Solutions/plantuml-mcp.git
cd plantuml-mcp
npm install
npm run build
```

## Usage

### With Claude Desktop

Add the server to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "plantuml": {
      "command": "node",
      "args": ["/absolute/path/to/plantuml-mcp/build/index.js"]
    }
  }
}
```

Then restart Claude Desktop.

### With Claude.ai

Add the server via the MCP settings in Claude.ai and point it to your running server.

## How It Works

The server exposes two tools:

**`read_docs`** — fetches the official PlantUML syntax documentation for the requested diagram type from the bundled markdown files. Claude always calls this first.

**`create_diagram`** — takes valid PlantUML markup, encodes it, and returns:
- An inline image rendered via the PlantUML server
- A link to open and edit the diagram in the [PlantUML Editor](https://editor.plantuml.com)

### Generation Rules

Every generated diagram follows these defaults:

- ✅ Standard UML notation and conventions
- ✅ Clean, minimal markup
- ❌ No `title` directive
- ❌ No colors or custom `skinparam` styling (unless explicitly requested)

## Example Prompts

```
Use the plantuml MCP to create a sequence diagram showing a user login flow
with JWT authentication.
```

```
Use the plantuml MCP to create a class diagram for an e-commerce platform
with Order, Product, Customer, and Payment classes.
```

```
Use the plantuml MCP to create a state diagram for a subscription lifecycle
including trial, active, past due, paused, and cancelled states.
```

## Development

```bash
# Run directly without building (recommended for development)
npm run dev

# Build
npm run build

# Build output
build/
├── index.js
└── resources/
    ├── plantuml-sequence-diagram-docs.md
    ├── plantuml-class-diagram-docs.md
    └── ...
```

### Project Structure

```
src/
├── index.ts                  # MCP server entry point, tool registration
├── resources/                # PlantUML syntax documentation (markdown)
│   ├── plantuml-sequence-diagram-docs.md
│   ├── plantuml-class-diagram-docs.md
│   └── ...
└── utils/
    └── register-resources.ts # Auto-registers all markdown docs as MCP resources
```

### Scripts

```bash
npm run build          # Compile TypeScript + copy resources to build/
npm run dev            # Run with tsx (no build step)
npm run fetch:plantuml-docs  # Fetch latest PlantUML docs into resources/
```

## Tech Stack

- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [plantuml-encoder](https://www.npmjs.com/package/plantuml-encoder)
- [Zod](https://zod.dev) — input schema validation
- [TypeScript](https://www.typescriptlang.org)

## License

ISC © Mees Egberts