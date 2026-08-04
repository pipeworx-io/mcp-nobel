# mcp-nobel

Nobel MCP — wraps the Nobel Prize API v2 (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_laureates` | Search Nobel Prize laureates by name and/or category (e.g., "Physics", "Medicine", "Literature"). Returns biography, prizes won, and award motivation. |
| `get_prizes_by_year` | Get all Nobel Prizes awarded in a specific year, optionally filtered by category (e.g., "Chemistry", "Peace"). Returns laureate names, categories, and citations. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "nobel": {
      "url": "https://gateway.pipeworx.io/nobel/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Nobel data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
